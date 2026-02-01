from django.db import models

class Dataset(models.Model):
    uploaded_at = models.DateTimeField(auto_now_add=True)
    total_items = models.IntegerField()
    avg_flowrate = models.FloatField()
    avg_pressure = models.FloatField()
    avg_temperature = models.FloatField()

    class Meta:
        ordering = ['-uploaded_at']

    def __str__(self):
        return f"Dataset {self.id} - {self.uploaded_at}"

