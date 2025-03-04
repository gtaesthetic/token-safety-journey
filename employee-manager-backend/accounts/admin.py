
from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from .models import User, Employee, Manager

class EmployeeInline(admin.StackedInline):
    model = Employee
    can_delete = False

class ManagerInline(admin.StackedInline):
    model = Manager
    can_delete = False

class UserAdmin(BaseUserAdmin):
    list_display = ('email', 'first_name', 'last_name', 'role', 'is_staff', 'is_active')
    list_filter = ('role', 'is_staff', 'is_active')
    fieldsets = (
        (None, {'fields': ('email', 'password')}),
        ('Personal info', {'fields': ('first_name', 'last_name', 'role')}),
        ('Permissions', {'fields': ('is_active', 'is_staff', 'is_superuser', 'groups', 'user_permissions')}),
    )
    add_fieldsets = (
        (None, {
            'classes': ('wide',),
            'fields': ('email', 'first_name', 'last_name', 'role', 'password1', 'password2'),
        }),
    )
    search_fields = ('email', 'first_name', 'last_name')
    ordering = ('email',)
    
    def get_inline_instances(self, request, obj=None):
        if not obj:
            return []
        
        inlines = []
        if obj.role == 'employee':
            inlines.append(EmployeeInline(self.model, self.admin_site))
        elif obj.role == 'manager':
            inlines.append(ManagerInline(self.model, self.admin_site))
        
        return inlines

admin.site.register(User, UserAdmin)
admin.site.register(Employee)
admin.site.register(Manager)
