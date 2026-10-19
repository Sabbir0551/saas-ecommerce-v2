<?php

declare(strict_types=1);

use App\Models\Tenant;
use Database\Seeders\TenantDatabaseSeeder;
use Stancl\Tenancy\Database\Models\Domain;

return [
    'tenant_model' => Tenant::class,

    /**
     * সাবডোমেইন সরাসরি টেন্যান্ট আইডি হিসেবে ব্যবহারের জন্য UUIDGenerator বন্ধ রাখা হলো।
     * এতে Tenant::create(['id' => 'artstore']) সরাসরি কাজ করবে।
     */
    'id_generator' => null,

    'domain_model' => Domain::class,

    /**
     * The list of domains hosting your central app.
     * Only relevant if you're using the domain or subdomain identification middleware.
     */
    'central_domains' => [
        '127.0.0.1',
        'localhost',
        'saas-ecommerce.test',
    ],

    /**
     * Tenancy bootstrappers are executed when tenancy is initialized.
     * Their responsibility is making Laravel features tenant-aware.
     */
    'bootstrappers' => [
        Stancl\Tenancy\Bootstrappers\DatabaseTenancyBootstrapper::class,
        // Stancl\Tenancy\Bootstrappers\CacheTenancyBootstrapper::class,
        Stancl\Tenancy\Bootstrappers\FilesystemTenancyBootstrapper::class,
        Stancl\Tenancy\Bootstrappers\QueueTenancyBootstrapper::class,
        // Stancl\Tenancy\Bootstrappers\RedisTenancyBootstrapper::class,
    ],

    /**
     * Database tenancy config. Used by DatabaseTenancyBootstrapper.
     */
    'database' => [
        'central_connection' => env('DB_CONNECTION', 'mysql'),

        /**
         * Connection used as a "template" for the dynamically created tenant database connection.
         */
        'template_tenant_connection' => null,

        /**
         * Tenant database names are created like this: prefix + tenant_id + suffix.
         */
        'prefix' => 'tenant_',
        'suffix' => '',

        /**
         * TenantDatabaseManagers handle the creation & deletion of tenant databases.
         */
        'managers' => [
            'sqlite' => Stancl\Tenancy\TenantDatabaseManagers\SQLiteDatabaseManager::class,
            'mysql' => Stancl\Tenancy\TenantDatabaseManagers\MySQLDatabaseManager::class,
            'mariadb' => Stancl\Tenancy\TenantDatabaseManagers\MySQLDatabaseManager::class,
            'pgsql' => Stancl\Tenancy\TenantDatabaseManagers\PostgreSQLDatabaseManager::class,
        ],
    ],

    /**
     * Cache tenancy config. Used by CacheTenancyBootstrapper.
     */
    'cache' => [
        'tag_base' => 'tenant',
    ],

    /**
     * Filesystem tenancy config. Used by FilesystemTenancyBootstrapper.
     */
    'filesystem' => [
        'suffix_base' => 'tenant',
        'disks' => [
            'local',
            'public',
        ],

        'root_override' => [
            'local' => '%storage_path%/app/',
            'public' => '%storage_path%/app/public/',
        ],

        'suffix_storage_path' => false,
        'asset_helper_tenancy' => false,
    ],

    /**
     * Redis tenancy config. Used by RedisTenancyBootstrapper.
     */
    'redis' => [
        'prefix_base' => 'tenant',
        'prefixed_connections' => [
            // 'default',
        ],
    ],

    /**
     * Features are classes that provide additional functionality.
     */
    'features' => [
        // Stancl\Tenancy\Features\UserImpersonation::class,
        // Stancl\Tenancy\Features\TelescopeTags::class,
        Stancl\Tenancy\Features\UniversalRoutes::class,
        Stancl\Tenancy\Features\CrossDomainRedirect::class,
        // Stancl\Tenancy\Features\TenantConfig::class,
        // Stancl\Tenancy\Features\ViteBundler::class,
    ],

    /**
     * Should tenancy routes be registered.
     */
    'routes' => true,

    /**
     * Parameters used by the tenants:migrate command.
     */
    'migration_parameters' => [
        '--force' => true,
        '--path' => [database_path('migrations/tenant')],
        '--realpath' => true,
    ],

    /**
     * Parameters used by the tenants:seed command.
     */
    'seeder_parameters' => [
        '--class' => TenantDatabaseSeeder::class, // টেন্যান্ট ডাটাবেজের জন্য সঠিক সিডার সেট করা হলো
    ],
];