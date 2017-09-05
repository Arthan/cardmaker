from modeltranslation.translator import translator, TranslationOptions
from .models import Layout

class LayoutTranslationOptions(TranslationOptions):
    fields = ('caption',)

translator.register(Layout, LayoutTranslationOptions)