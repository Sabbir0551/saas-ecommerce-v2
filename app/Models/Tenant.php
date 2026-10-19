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
            'status',
            'suspended_reason',
            'suspended_at',
            'trade_license_no',
            'trade_license_file',
            'trade_license_verified_at',
            'nid_no',
            'nid_file',
            'nid_verified_at',
            'drug_license_no',
            'drug_license_file',
            'drug_license_verified_at',
            'bmdc_reg_no',
            'bmdc_verified_at',
            'tin_no',
            'bin_no',
            'pra_no',
            'verification_status',
            'verification_notes',
            'gateway_credentials',
            'terms_accepted',
        ];
    }

    protected function casts(): array
    {
        return [
            'gateway_credentials'       => 'array',
            'drug_license_verified_at'  => 'datetime',
            'trade_license_verified_at' => 'datetime',
            'nid_verified_at'           => 'datetime',
            'bmdc_verified_at'          => 'datetime',
            'suspended_at'              => 'datetime',
            'terms_accepted'            => 'boolean',
        ];
    }

    /**
     * Archetype Helpers & Compatibility Resolvers
     */
    public function isPhysicalCommerce(): bool
    {
        return in_array($this->archetype, ['physical_store', 'commerce'], true);
    }

    public function isFoodMenu(): bool
    {
        return in_array($this->archetype, ['food_menu'], true);
    }

    public function isServiceBooking(): bool
    {
        return in_array($this->archetype, ['service_booking', 'service'], true);
    }

    public function isListingInquiry(): bool
    {
        return in_array($this->archetype, ['listing_inquiry', 'lead_gen', 'lead'], true);
    }

    public function isDigitalCourse(): bool
    {
        return in_array($this->archetype, ['digital_course'], true);
    }

    public function isPortfolioContent(): bool
    {
        return in_array($this->archetype, ['portfolio_content', 'content'], true);
    }

    public function hasPhysicalInventory(): bool
    {
        return $this->isPhysicalCommerce() || $this->isFoodMenu();
    }

    public function getEffectiveArchetype(): string
    {
        if ($this->isFoodMenu()) return 'food_menu';
        if ($this->isServiceBooking()) return 'service_booking';
        if ($this->isListingInquiry()) return 'listing_inquiry';
        if ($this->isDigitalCourse()) return 'digital_course';
        if ($this->isPortfolioContent()) return 'portfolio_content';
        return 'physical_store';
    }
}