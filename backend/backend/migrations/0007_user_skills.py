# Generated by Django 5.0.4 on 2024-11-09 17:44

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('backend', '0006_joblisting_working_style'),
    ]

    operations = [
        migrations.AddField(
            model_name='user',
            name='skills',
            field=models.JSONField(default=list),
        ),
    ]
