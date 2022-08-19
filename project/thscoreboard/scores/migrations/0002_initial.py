# Generated by Django 4.1 on 2022-08-19 05:46

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        ('scores', '0001_initial'),
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.AddField(
            model_name='temporaryreplayfile',
            name='user',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL),
        ),
        migrations.AddField(
            model_name='shot',
            name='game',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='scores.game'),
        ),
        migrations.AddField(
            model_name='score',
            name='shot',
            field=models.ForeignKey(on_delete=django.db.models.deletion.PROTECT, to='scores.shot'),
        ),
        migrations.AddField(
            model_name='score',
            name='user',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL),
        ),
        migrations.AddField(
            model_name='replayfile',
            name='score',
            field=models.OneToOneField(on_delete=django.db.models.deletion.CASCADE, to='scores.score'),
        ),
        migrations.AddConstraint(
            model_name='shot',
            constraint=models.UniqueConstraint(models.F('shot_id'), models.F('game'), name='unique_shot_per_game'),
        ),
        migrations.AddConstraint(
            model_name='score',
            constraint=models.CheckConstraint(check=models.Q(('difficulty__gte', 0)), name='difficulty_gte_0'),
        ),
    ]
