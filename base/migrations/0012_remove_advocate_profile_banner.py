# Generated by Django 4.0 on 2022-12-18 20:49

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('base', '0011_advocate_profile_banner'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='advocate',
            name='profile_banner',
        ),
    ]
