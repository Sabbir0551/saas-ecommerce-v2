<?php

namespace App\Filament\Resources\OrderResource\Pages;

use App\Filament\Resources\OrderResource;
use Filament\Actions;
use Filament\Resources\Pages\ListRecords;
use Filament\Resources\Components\Tab;
use Illuminate\Database\Eloquent\Builder;

class ListOrders extends ListRecords
{
    protected static string $resource = OrderResource::class;

    protected function getHeaderActions(): array
    {
        $archetype = tenant('archetype') ?? 'commerce';

        $actions = [];

        // ডাক্তারের জন্য আজকের পেশেন্ট ডেইলি লিস্ট প্রিন্ট / ডাউনলোড বাটন
        if ($archetype === 'service') {
            $actions[] = Actions\Action::make('print_daily_sheet')
                ->label('আজকের সিরিয়াল শিট (PDF / Print)')
                ->icon('heroicon-o-printer')
                ->color('success')
                ->url(fn (): string => route('admin.daily.appointments', ['date' => today()->toDateString()]))
                ->openUrlInNewTab();
        }

        $actions[] = Actions\CreateAction::make()
            ->label($archetype === 'service' ? 'নতুন অ্যাপয়েন্টমেন্ট' : 'নতুন অর্ডার');

        return $actions;
    }

    /**
     * ই-কমার্সের অপ্রাসঙ্গিক ট্যাব সরিয়ে ডাক্তারের জন্য সামঞ্জস্যপূর্ণ ট্যাব
     */
    public function getTabs(): array
    {
        $archetype = tenant('archetype') ?? 'commerce';

        if ($archetype === 'service') {
            return [
                'all' => Tab::make('সকল সিরিয়াল'),
                'today' => Tab::make('আজকের রোগী')
                    ->modifyQueryUsing(fn (Builder $query) => $query->whereDate('booking_date', today()))
                    ->badge(fn () => $this->getModel()::whereDate('booking_date', today())->count()),
                'pending' => Tab::make('অপেক্ষমান (Pending)')
                    ->modifyQueryUsing(fn (Builder $query) => $query->where('status', 'pending'))
                    ->badge(fn () => $this->getModel()::where('status', 'pending')->count()),
                'visited' => Tab::make('সাক্ষাৎ সম্পন্ন (Visited)')
                    ->modifyQueryUsing(fn (Builder $query) => $query->where('status', 'visited')),
                'rescheduled' => Tab::make('Re-Scheduled')
                    ->modifyQueryUsing(fn (Builder $query) => $query->where('status', 'rescheduled')),
                'cancelled' => Tab::make('বাতিল (Cancel)')
                    ->modifyQueryUsing(fn (Builder $query) => $query->where('status', 'cancelled')),
            ];
        }

        return parent::getTabs();
    }
}