<?php

namespace App\Models;

use Stancl\Tenancy\Contracts\TenantWithDatabase;
use Stancl\Tenancy\Database\Concerns\HasDatabase;
use Stancl\Tenancy\Database\Concerns\HasDomains;
use Stancl\Tenancy\Database\Models\Tenant as BaseTenant;

class Tenant extends BaseTenant implements TenantWithDatabase
{
    use HasDatabase, HasDomains;

    protected $primaryKey = 'id';
    protected $keyType = 'string';
    public $incrementing = false;

    /**
     * Eloquent যাতে আইডিকে কখনোই ইন্টিজারে কাস্ট না করে
     */
    public function getIncrementing(): bool
    {
        return false;
    }

    public function getKeyType(): string
    {
        return 'string';
    }

    /**
     * সেন্ট্রাল ডাটাবেজের কাস্টম কলামের তালিকা
     * এই কলামগুলো data JSON-এ না গিয়ে সরাসরি টেবিলের নির্দিষ্ট কলামে সেভ হবে
     */
    public static function getCustomColumns(): array
    {
        return [
            'id',
            'business_category',
            'archetype',
            'name',
            'owner_email',
            'owner_phone',
            'plan',
            'drug_license_no',
            'drug_license_file',
            'drug_license_verified_at',
            'gateway_credentials',
            'terms_accepted',
        ];
    }

    protected function casts(): array
    {
        return [
            'gateway_credentials' => 'array',
            'drug_license_verified_at' => 'datetime',
            'terms_accepted' => 'boolean',
        ];
    }
}