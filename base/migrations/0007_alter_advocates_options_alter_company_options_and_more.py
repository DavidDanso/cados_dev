# Generated by Django 4.0 on 2022-12-13 13:37

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('base', '0006_advocates_created_at_advocates_updated_time_stamp_and_more'),
    ]

    operations = [
        migrations.AlterModelOptions(
            name='advocates',
            options={'ordering': ['-updated_time_stamp']},
        ),
        migrations.AlterModelOptions(
            name='company',
            options={'ordering': ['-updated_time_stamp']},
        ),
        migrations.AddField(
            model_name='advocates',
            name='name',
            field=models.CharField(blank=True, max_length=200, null=True),
        ),
        migrations.AddField(
            model_name='advocates',
            name='profile_pic',
            field=models.CharField(blank=True, max_length=200, null=True),
        ),
    ]
