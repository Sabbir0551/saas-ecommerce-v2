<?php

namespace App\Filament\Resources;

use App\Filament\Resources\ReviewResource\Pages;
use App\Models\Review;
use Filament\Forms;
use Filament\Forms\Form;
use Filament\Forms\Components\Section;
use Filament\Forms\Components\TextInput;
use Filament\Forms\Components\Textarea;
use Filament\Forms\Components\Toggle;
use Filament\Resources\Resource;
use Filament\Tables;
use Filament\Tables\Table;
use Filament\Tables\Columns\TextColumn;
use Filament\Tables\Columns\IconColumn;
use Filament\Tables\Actions\Action;

class ReviewResource extends Resource
{
    protected static ?string $model = Review::class;

    protected static ?string $navigationIcon = 'heroicon-o-star';

    protected static ?string $navigationLabel = 'Customer Reviews & Ratings';

    protected static ?string $navigationGroup = 'Customer Support & Compliance';

    // Anti-Delete Compliance: Prevent hard deletion of customer reviews
    public static function canDelete($record): bool
    {
        return false;
    }

    public static function form(Form $form): Form
    {
        return $form->schema([
            Section::make('Customer Review Details')->schema([
                TextInput::make('customer_name')->disabled(),
                TextInput::make('customer_phone')->disabled(),
                TextInput::make('rating')->disabled(),
                Textarea::make('comment')->disabled()->columnSpanFull(),
            ])->columns(3),

            Section::make('Review Moderation & Legal Compliance (ডিজিটাল কমার্স নির্দেশিকা ২০২১)')->schema([
                Toggle::make('is_hidden')
                    ->label('Hide this review from storefront')
                    ->helperText('আইনানুযায়ী কোনো পর্যালোচনা মুছে ফেলা যাবে না। কেবল বেআইনি বা অবমাননাকর হলে কারণ উল্লেখপূর্বক লুকানো যাবে।'),

                TextInput::make('hide_reason')
                    ->label('Reason for Hiding Review')
                    ->placeholder('e.g., Obscene language / illegal content violation')
                    ->required(fn ($get) => $get('is_hidden')),
            ]),
        ]);
    }

    public static function table(Table $table): Table
    {
        return $table
            ->columns([
                TextColumn::make('item.name')
                    ->label('Product / Item')
                    ->searchable()
                    ->limit(25),

                TextColumn::make('customer_name')
                    ->label('Customer')
                    ->searchable(),

                TextColumn::make('customer_phone')
                    ->label('Phone'),

                TextColumn::make('rating')
                    ->label('Rating')
                    ->badge()
                    ->color(fn (int $state): string => match (true) {
                        $state >= 4 => 'success',
                        $state === 3 => 'warning',
                        default => 'danger',
                    })
                    ->formatStateUsing(fn ($state) => "⭐ {$state}/5")
                    ->sortable(),

                TextColumn::make('comment')
                    ->label('Review')
                    ->limit(40)
                    ->searchable(),

                IconColumn::make('is_hidden')
                    ->label('Hidden')
                    ->boolean()
                    ->trueIcon('heroicon-o-eye-slash')
                    ->falseIcon('heroicon-o-eye')
                    ->trueColor('danger')
                    ->falseColor('success'),

                TextColumn::make('created_at')
                    ->label('Date')
                    ->dateTime('M d, Y')
                    ->sortable(),
            ])
            ->defaultSort('created_at', 'desc')
            ->actions([
                Action::make('toggle_visibility')
                    ->label(fn (Review $record) => $record->is_hidden ? 'Unhide' : 'Hide Review')
                    ->icon(fn (Review $record) => $record->is_hidden ? 'heroicon-o-eye' : 'heroicon-o-eye-slash')
                    ->color(fn (Review $record) => $record->is_hidden ? 'success' : 'danger')
                    ->form(fn (Review $record) => $record->is_hidden ? [] : [
                        TextInput::make('reason')
                            ->label('Legal / Policy Reason for Hiding')
                            ->required()
                            ->placeholder('e.g., Profanity / defamatory false statements'),
                    ])
                    ->action(function (Review $record, array $data) {
                        if ($record->is_hidden) {
                            $record->update([
                                'is_hidden'   => false,
                                'hide_reason' => null,
                                'hidden_at'   => null,
                                'hidden_by'   => null,
                            ]);
                        } else {
                            $record->update([
                                'is_hidden'   => true,
                                'hide_reason' => $data['reason'] ?? 'Hidden by store admin',
                                'hidden_at'   => now(),
                                'hidden_by'   => auth()->id(),
                            ]);
                        }

                        \Filament\Notifications\Notification::make()
                            ->title('Review visibility updated')
                            ->success()
                            ->send();
                    }),
            ]);
    }

    public static function getPages(): array
    {
        return [
            'index' => Pages\ListReviews::route('/'),
        ];
    }
}
