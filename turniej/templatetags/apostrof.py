from django import template

register = template.Library()

@register.filter
def apostrof(value):
    return value.replace("'", "\\'")
    
    