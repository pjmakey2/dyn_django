from django.shortcuts import render
from django.views.generic import TemplateView


# Create your views here.

class ProductUi(TemplateView):
    template_name = 'ProductUi.html'

    def get(self, request):
        context = {
            'title': 'Product',
        }
        return render(request,
                      self.template_name,
                      context)
    

class CustomerUi(TemplateView):
    template_name = 'CustomerUi.html'

    def get(self, request):
        context = {
            'title': 'Product',
        }
        return render(request, 
                      self.template_name, 
                      context)