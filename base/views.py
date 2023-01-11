from rest_framework.decorators import api_view
from rest_framework.response import Response
from django.db.models import Q
from django.core.paginator import Paginator, PageNotAnInteger, EmptyPage
import os
import requests
from django.http import Http404
from dotenv import load_dotenv
load_dotenv()

from .models import *
from .serializers import *
from .urls import *

TWITTER_API_BEARER_TOKEN = os.environ.get('TWITTER_API_BEARER_TOKEN')

# Create your views here.
@api_view(['GET'])
def endpoints(request):
    data = ['advocates/', 'advocate/username/', 'companies/']
    return Response(data)

@api_view(['GET', 'POST'])
def advocates(request):
    # check if any user has 'null' as the name
    try:
        null_names = Advocate.objects.filter(Q(name__isnull=True)).values('username')
        # loop though all users with 'null' as the name and delete them
        for name in null_names:
            null_advocates = name['username']
            delete_advocate = Advocate.objects.get(username=null_advocates)
            delete_advocate.delete()
    # if username does not have 'null' as the name skip condition
    except:
            pass

    # Handles GET request[ QUERY A PARTICULAR USER FROM THE DATABASE ]
    if request.method == 'GET':
        query = request.GET.get('query')
        if query == None:
            query = ''
        advocates = Advocate.objects.filter(Q(username__icontains=query) | Q(bio__icontains=query) | Q(name__icontains=query))
        
        # paginate view to navigate through pages
        page = request.GET.get('page')
        results = 400
        paginator = Paginator(advocates, results)
        page_count = list(paginator.page_range)
        try:
            paginate_page = paginator.page(page)
        except PageNotAnInteger:
            page = 1
            paginate_page = paginator.page(page)
        except EmptyPage:
            page = paginator.num_pages
            paginate_page = paginator.page(page)
        serializer = AdvocateSerializer(paginate_page, many=True)
        response = {
            "pagination": {
                "current_page": page,
                "total_pages": paginator.num_pages,
                "pages": page_count[:11],
                "has_previous": paginate_page.has_previous(),
                "has_next": paginate_page.has_next(),
                "prev_page": paginate_page.previous_page_number() if paginate_page.has_previous() else False,
                "next_page": paginate_page.next_page_number() if paginate_page.has_next() else False,
                "results_found": paginator.count
            },
            "total": paginator.count,
            "advocates": serializer.data
        }
        return Response(response)

    # Handles POST request[ CREATE A NEW USER ]
    if request.method == 'POST':
        username = request.data['username']
        # check if username already exists in database, 
        # if YES do not add it into the database again
        try:
            advocate = Advocate.objects.get(username=username)
            pass
        # if username does not exists in database create new advocate
        except:
            advocate = Advocate.objects.create(
                username = request.data['username']
            )
        serializer = AdvocateSerializer(advocate, many=False)
        return Response(serializer.data)

            
@api_view(['GET', 'PUT', 'DELETE'])
def advocate_detail(request, username):
    try:
        advocate = Advocate.objects.get(username=username)
    except Advocate.DoesNotExist:
        raise Http404

    if request.method == 'GET':
        # getting extra fields from the TWITTER API
        fields ="?user.fields=profile_image_url,description,public_metrics"
        headers = {"Authorization": f"Bearer {TWITTER_API_BEARER_TOKEN}"}
        url = f"https://api.twitter.com/2/users/by/username/{username}{fields}"
        response = requests.get(url, headers=headers).json()
        data = response['data']

        # changing the image size of the profile_images from TWITTER
        data['profile_image_url'] = data['profile_image_url'].replace('normal', '400x400')

        advocate = Advocate.objects.get(username=username)
        advocate.name = data['name']
        advocate.profile_pic = data['profile_image_url']
        advocate.username = data['username']
        advocate.bio = data['description']
        advocate.twitter = f"https://twitter.com/{username}"
        advocate.save()
        serializer = AdvocateSerializer(advocate, many=False)
        return Response(serializer.data)

    if request.method == 'PUT':
        advocate.username = request.data['username']
        advocate.bio = request.data['bio']
        advocate.save()
        serializer = AdvocateSerializer(advocate, many=False)
        return Response(serializer.data)

    if request.method == 'DELETE':
        advocate = Advocate.objects.get(username=username)
        advocate.delete()
        return Response(f'{advocate.username} was deleted successfully')

