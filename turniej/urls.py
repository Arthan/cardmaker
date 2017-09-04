"""mim_turniej URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/1.10/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  url(r'^$', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  url(r'^$', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.conf.urls import url, include
    2. Add a URL to urlpatterns:  url(r'^blog/', include('blog.urls'))
"""
from django.conf.urls import url
from django.contrib.auth import views as auth_views
from . import views

urlpatterns = [
    url(r'^$', views.generator, name='index'),
    url(r'^check_title/$', views.check_title, name='check_title'),
    url(r'^list/$', views.card_list, name='card_list'),
    url(r'^signup/$', views.signup, name='signup'),
    url(r'^login/$', auth_views.login, {'template_name': 'login.html'}, name='login'),
    url(r'^logout/$', auth_views.logout, {'next_page': '/'}, name='logout'),
    url(r'^(?P<card_id>[a-f0-9\-]{36})/$', views.generator, name='index'),
    url(r'^canvas$', views.canvas, name='canvas'),
    url(r'^images$', views.image_list, name='image_list'),
    url(r'^(?P<game_name>\w+)/$', views.generator, name='generator'),
    url(r'^(?P<game_name>\w+)/(?P<card_id>[a-f0-9\-]{36})/$', views.generator, name='generator'),
]
