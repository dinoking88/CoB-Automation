from django.db import models

class HexMap(models.Model):
    mapTitle = models.CharField(max_length=50)
    height = models.IntegerField(default=1000)
    width = models.IntegerField(default=1000)

    def __str__(self):
        return self.mapTitle

class Hex(models.Model):
    map = models.ForeignKey(HexMap, on_delete=models.CASCADE)
    hexId = models.CharField(max_length=10)
    col = models.CharField(max_length=4)
    row = models.IntegerField(default=0)
    tileType = models.CharField(max_length=50, default='Deep Water')

    topBorderTile = models.CharField(max_length=10, default='standard')
    topBorderType = models.CharField(max_length=30, default='standard')
    topRightBorderTile = models.CharField(max_length=10, default='standard')
    topRightBorderType = models.CharField(max_length=30, default='standard')
    topLeftBorderTile = models.CharField(max_length=10, default='standard')
    topLeftBorderType = models.CharField(max_length=30, default='standard')
    rightBorderTile = models.CharField(max_length=10, default='standard')
    rightBorderType = models.CharField(max_length=30, default='standard')
    leftBorderTile = models.CharField(max_length=10, default='standard')
    leftBorderType = models.CharField(max_length=30, default='standard')
    bottomLeftBorderTile = models.CharField(max_length=10, default='standard')
    bottomLeftBorderType = models.CharField(max_length=30, default='standard')
    bottomRightBorderTile = models.CharField(max_length=10, default='standard')
    bottomRightBorderType = models.CharField(max_length=30, default='standard')
    bottomBorderTile = models.CharField(max_length=10, default='standard')
    bottomBorderType = models.CharField(max_length=30, default='standard')

    def __str__(self):
        return self.hexId