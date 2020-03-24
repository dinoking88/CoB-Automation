from django.contrib import admin

from .models import HexMap, Hex

class HexInLine(admin.TabularInline):
    model = Hex
    extra = 3

class HexMapAdmin(admin.ModelAdmin):
    fieldsets = [(None, {'fields': ['mapTitle']}),
    ('Map Size', {'fields': ['height', 'width']}),]
    inlines = [HexInLine]

admin.site.register(HexMap, HexMapAdmin)