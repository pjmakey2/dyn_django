# Generated by Django 4.2.1 on 2023-05-24 02:27

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('s_manage', '0001_initial'),
    ]

    operations = [
        migrations.AlterField(
            model_name='product',
            name='pack',
            field=models.BooleanField(default=False),
        ),
    ]
