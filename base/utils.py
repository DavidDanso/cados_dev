from .models import Advocate
from django.core.paginator import Paginator, PageNotAnInteger, EmptyPage

def paginateAdvocate(request, advocate, results):
    page = request.GET.get('page')
    paginator = Paginator(advocate, results)

    try:
        advocate = paginator.page(page)
    except PageNotAnInteger:
        page = 1
        advocate = paginator.page(page)
    except EmptyPage:
        page = paginator.num_pages
        advocate = paginator.page(page)

    leftIndex = (int(page) - 4)

    if leftIndex < 1:
        leftIndex = 1

    rightIndex = (int(page) + 5)

    if rightIndex > paginator.num_pages:
        rightIndex = paginator.num_pages + 1

    custom_range = range(leftIndex, rightIndex)

    return custom_range, advocate


