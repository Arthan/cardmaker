from django import template

register = template.Library()

@register.filter
def new_lines(value):
    return value.replace(chr(13)+chr(10),"\\n").replace(chr(13),"\\n").replace(chr(10),"\\n")
    
    