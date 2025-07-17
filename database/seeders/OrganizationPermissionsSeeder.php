<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;
use Spatie\Permission\PermissionRegistrar;

class OrganizationPermissionsSeeder extends Seeder
{
    public function run(): void
    {
        app()[PermissionRegistrar::class]->forgetCachedPermissions();

        $permissions = [
            'manage organizations',
            'view organizations',
            'edit organization',
            'delete organization',
            'view own organization',
        ];
        foreach ($permissions as $perm) {
            Permission::firstOrCreate(['name' => $perm, 'guard_name' => 'web']);
        }

        // Asignar permisos a roles
        $admin = Role::firstOrCreate(['name' => 'admin', 'guard_name' => 'web']);
        $dpd = Role::firstOrCreate(['name' => 'dpd', 'guard_name' => 'web']);
        $usuario = Role::firstOrCreate(['name' => 'usuario', 'guard_name' => 'web']);

        $admin->givePermissionTo($permissions);
        $dpd->givePermissionTo([
            'view organizations',
            'edit organization',
            'view own organization',
        ]);
        $usuario->givePermissionTo([
            'view own organization',
        ]);
    }
} 