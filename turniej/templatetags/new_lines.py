from django import template

register = template.Library()

@register.filter
def new_lines(value):
    value = value.replace("'", "\\'")
    return value.replace(chr(13)+chr(10),"\\n")
    
    