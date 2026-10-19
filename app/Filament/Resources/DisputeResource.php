<?php

namespace App\Filament\Resources;

use App\Filament\Resources\DisputeResource\Pages;
use App\Models\Dispute;
use Filament\Forms;
use Filament\Forms\Form;
use Filament\Forms\Components\Section;
use Filament\Forms\Components\TextInput;
use Filament\Forms\Components\Textarea;
use Filament\Forms\Components\Select;
use Filament\Forms\Components\DateTimePicker;
use Filament\Resources\Resource;
use Filament\Tables;
use Filament\Tables\Table;
use Filament\Tables\Columns\TextColumn;
use Filament\Tables\Actions\Action;

class DisputeResource extends Resource
{
    protected static ?string $model = Dispute::class;

    protected static ?string $navigationIcon = 'heroicon-o-shield-exclamation';

    protected static ?string $navigationLabel = 'Disputes & Complaints (72h)';

    protected static ?string $navigationGroup = 'Customer Support & Compliance';

    public static function getNavigationBadge(): ?string
    {
        $openCount = Dispute::where('status', 'open')->count();
        return $openCount > 0 ? (string) $openCount : null;
    }

    public static function getNavigationBadgeColor(): ?string
    {
        return 'danger';
    }

    public static function form(Form $form): Form
    {
        return $form->schema([
            Section::make('Dispute Ticket Information')->schema([
                TextInput::make('ticket_number')
                    ->label('Ticket #')
                    ->disabled(),

                TextInput::make('customer_name')
                    ->label('Customer Name')
                    ->disabled(),

                TextInput::make('customer_phone')
                    ->label('Customer Phone')
                    ->disabled(),

                TextInput::make('subject')
                    ->label('Complaint Subject')
                    ->disabled()
                    ->columnSpanFull(),

                Textarea::make('description')
                    ->label('Detailed Complaint')
                    ->disabled()
                    ->columnSpanFull(),
            ])->columns(3),

            Section::make('Resolution & Digital Commerce Compliance')->schema([
                Select::make('status')
                    ->label('Dispute Status')
                    ->options([
                        'open'        => 'Open (Pending Resolution)',
                        'in_progress' => 'In Progress (Investigating)',
                        'resolved'    => 'Resolved (Customer Satisfied)',
                        'escalated'   => 'Escalated to Superadmin',
                    ])
                    ->required(),

                DateTimePicker::make('deadline_at')
                    ->label('72-Hour Legal Deadline')
                    ->disabled(),

                Textarea::make('resolution_notes')
                    ->label('Resolution / Action Taken Notes')
                    ->placeholder('State how the customer dispute was resolved (e.g. replacement dispatched / refund sent via bKash)...')
                    ->columnSpanFull(),
            ])->columns(2),
        ]);
    }

    public static function table(Table $table): Table
    {
        return $table
            ->columns([
                TextColumn::make('ticket_number')
                    ->label('Ticket #')
                    ->searchable()
                    ->weight('bold')
                    ->copyable(),

                TextColumn::make('customer_name')
                    ->label('Customer')
                    ->searchable(),

                TextColumn::make('customer_phone')
                    ->label('Phone')
                    ->searchable()
                    ->copyable(),

                TextColumn::make('subject')
                    ->label('Subject')
                    ->limit(35)
                    ->searchable(),

                TextColumn::make('status')
                    ->label('Status')
                    ->badge()
                    ->color(fn ($state): string => match ((string) $state) {
                        'resolved'    => 'success',
                        'in_progress' => 'warning',
                        'escalated'   => 'danger',
                        default       => 'danger',
                    }),

                TextColumn::make('hours_remaining')
                    ->label('72h Deadline Timer')
                    ->badge()
                    ->state(function (Dispute $record) {
                        if ($record->status === 'resolved') {
                            return 'Resolved';
                        }
                        if ($record->isExpired()) {
                            return '⚠️ Time Breached';
                        }
                        return "{$record->hours_remaining} hours left";
                    })
                    ->color(fn ($state): string => match (true) {
                        $state === 'Resolved' => 'success',
                        str_contains((string) $state, 'Breached') => 'danger',
                        default => 'warning',
                    })
                    ->sortable(),

                TextColumn::make('created_at')
                    ->label('Filed On')
                    ->dateTime('M d, H:i')
                    ->sortable(),
            ])
            ->defaultSort('created_at', 'desc')
            ->filters([
                Tables\Filters\SelectFilter::make('status')
                    ->options([
                        'open'        => 'Open',
                        'in_progress' => 'In Progress',
                        'resolved'    => 'Resolved',
                        'escalated'   => 'Escalated',
                    ]),
            ])
            ->actions([
                Action::make('resolve')
                    ->label('Mark Resolved')
                    ->icon('heroicon-o-check-circle')
                    ->color('success')
                    ->visible(fn (Dispute $record) => $record->status !== 'resolved')
                    ->form([
                        Textarea::make('notes')
                            ->label('Resolution Details')
                            ->required()
                            ->placeholder('Describe the resolution reached with the customer...'),
                    ])
                    ->action(function (Dispute $record, array $data) {
                        $record->update([
                            'status'           => 'resolved',
                            'resolution_notes' => $data['notes'],
                            'resolved_at'      => now(),
                        ]);

                        if ($record->order) {
                            $record->order->update(['dispute_status' => 'resolved']);
                        }

                        \Filament\Notifications\Notification::make()
                            ->title('Dispute Resolved')
                            ->body("Ticket {$record->ticket_number} marked as resolved.")
                            ->success()
                            ->send();
                    }),

                Tables\Actions\EditAction::make(),
            ]);
    }

    public static function getPages(): array
    {
        return [
            'index' => Pages\ListDisputes::route('/'),
            'edit'  => Pages\EditDispute::route('/{record}/edit'),
        ];
    }
}
