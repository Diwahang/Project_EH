from django.apps import AppConfig

class CreateConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'create'

    def ready(self):
        import create.signals
