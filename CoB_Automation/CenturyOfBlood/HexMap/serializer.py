from django.core.serializers import serialize
from .models import HexMap, Hex


hexes = Hex.objects.filter(map__mapTitle='CoBIbbenTest')
hexes = serialize('json', hexes, fields=['hexId', 'col', 'row', 'tileType', 'topBorderType', 'topRightBorderType', 'topLeftBorderType', 'rightBorderType', 'leftBorderType', 'bottomLeftBorderType', 'bottomRightBorderType', 'bottomBorderType']) 