<?php

namespace App\Filament\Superadmin\Resources\TenantResource\Pages;

use App\Filament\Superadmin\Resources\TenantResource;
use Filament\Notifications\Notification;
use Filament\Resources\Pages\CreateRecord;

class CreateTenant extends CreateRecord
{
    protected static string $resource = TenantResource::class;

    /**
     * টেন্যান্ট রেকর্ড তৈরি হওয়ার পরপরই domains টেবিলে স্বয়ংক্রিয়ভাবে সাবডোমেন যুক্ত করা
     */
    protected function afterCreate(): void
    {
        $tenant = $this->record;

        // যেমন: gadgethub.localhost
        $domainName = strtolower(trim((string) $tenant->id)) . '.localhost';

        $tenant->domains()->create([
            'domain' => $domainName,
        ]);
    }

    /**
     * স্টোর তৈরি সফল হলে কাস্টম নোটিফিকেশন প্রদর্শন
     */
    protected function getCreatedNotification(): ?Notification
    {
        return Notification::make()
            ->success()
            ->title('Store Provisioned Successfully')
            ->body("Store {$this->record->name} and domain {$this->record->id}.localhost have been set up.");
    }

    /**
     * স্টোর তৈরি সম্পন্ন হলে স্বয়ংক্রিয়ভাবে স্টোর লিস্ট পেজে ফিরে যাওয়া
     */
    protected function getRedirectUrl(): string
    {
        return $this->getResource()::getUrl('index');
    }
}