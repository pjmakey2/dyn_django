from django.views.generic import TemplateView
from django.http import JsonResponse
from django.shortcuts import render
from django.apps import apps
from eserials.e_models import m_mfields, m_form, f_mobj
import json

get_model = apps.get_model


class Home(TemplateView):
    template_name = "Base.html"

    def get(self, request):
        context = {}
        return render(request, self.template_name, context)


class Menu(TemplateView):
    template_name = "MenuUi.html"

    def get(self, request):
        context = {}
        return render(request, self.template_name, context)


class SearchModel(TemplateView):
    template_name = "SearchModelUi.html"

    def get(self, request):
        context = {"sitem": request.GET.get("sitem")}
        return render(request, self.template_name, context)

    def post(self, request):
        model_app_name = request.POST.get("model_app_name")
        model_name = request.POST.get("model_name")
        sitem = request.GET.get("sitem")
        model_class = get_model(model_app_name, model_name)
        data = [m_mfields(m, [], []) for m in f_mobj(model_class, sitem)]
        return JsonResponse({"records": data})


class GModel(TemplateView):
    def post(self, request):
        model_app_name = request.POST.get("model_app_name")
        model_name = request.POST.get("model_name")
        fields = request.POST.getlist("fields")
        ffields = request.POST.getlist("ffields")
        model_class = get_model(model_app_name, model_name)
        data = [m_mfields(m, ffields, fields) for m in model_class.objects.all()]
        return JsonResponse({"records": data})


class SModel(TemplateView):
    def get(self, request):
        model_app_name = request.GET.get("model_app_name")
        model_name = request.GET.get("model_name")
        order = request.GET.getlist("order")
        model_class = get_model(model_app_name, model_name)
        mform = m_form(model_class, order)
        return JsonResponse({"mform": mform})

    def post(self, request):
        model_app_name = request.POST.get("model_app_name")
        model_name = request.POST.get("model_name")
        fields = json.loads(request.POST.get("fields"))
        model_class = get_model(model_app_name, model_name)
        rsp = "created"
        if fields.get("pk"):
            model_class.objects.filter(pk=fields.get("pk")).update(**fields)
            rsp = "updated"
        else:
            model_class.objects.create(**fields)
        return JsonResponse({"sucess": rsp})
