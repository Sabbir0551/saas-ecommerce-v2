<x-filament-panels::page>
    <form wire:submit="submit" class="space-y-6">
        {{ $this->form }}

        <div class="flex justify-end pt-4 border-t border-zinc-800">
            <x-filament::button type="submit" size="lg" color="primary">
                Save Settings & Branding
            </x-filament::button>
        </div>
    </form>
</x-filament-panels::page>
