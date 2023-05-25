from django.forms import model_to_dict
from django.db import models


def a_mfield(instance, field):
    field_path = field.split("__")
    lfp = len(field_path)
    if len(field_path) > 1:
        attr = field_path[-1]
        for idx, fattr in enumerate(field_path):
            if idx + 1 == lfp:
                if not instance:
                    return None
                attr = getattr(instance, attr)
                if getattr(attr, "im_func", None):
                    return attr()
                return attr
            if not instance:
                return None
            instance = getattr(instance, fattr)
    attr = getattr(instance, field)
    if getattr(attr, "im_func", None):
        return attr()
    return attr


def m_mfields(mobj, sfields, fields):
    if fields:
        x = model_to_dict(mobj, fields=fields)
    else:
        x = model_to_dict(mobj)
    for hf in filter(lambda x: x.endswith("_id"), fields):
        x[hf] = getattr(mobj, hf)
    x["pk"] = mobj.pk
    x["id"] = mobj.pk
    for ff in sfields:
        value = a_mfield(mobj, ff)
        x[ff] = value
    return x


def m_form(model, order):
    fields = model._meta.fields
    json_data = []
    for field in fields:
        required = field.null is False and field.blank is False
        gtype = g_ft(field)
        if gtype == 'checkbox': required = False
        field_data = {
            "label": field.verbose_name.capitalize(),
            "name": field.column
            if isinstance(field, models.ForeignKey)
            else field.name,
            "type": gtype,
            "required": required,
            "readonly": field.auto_created or not field.editable,
            "foreignkey": isinstance(field, models.ForeignKey),
            "foreignmodel": field.related_model._meta.object_name
            if isinstance(field, models.ForeignKey)
            else False,
        }
        json_data.append(field_data)
    if order:
        json_data = sort_fields(json_data, order)
    return json_data


def g_ft(field):
    if field.auto_created:
        return "hidden"
    field_mapping = {
        models.CharField: "text",
        models.TextField: "textarea",
        models.IntegerField: "number",
        models.BooleanField: "checkbox",
        models.DateField: "text",
        models.DateTimeField: "text",
        models.EmailField: "email",
        models.FileField: "file",
        models.ImageField: "image",
        models.URLField: "url",
        models.DecimalField: "number",
        models.FloatField: "number",
        models.UUIDField: "text",
        models.ForeignKey: "text",
        # Add more field types as needed
    }
    for field_class, field_type in field_mapping.items():
        if isinstance(field, field_class):
            return field_type
    return "text"


def sort_fields(json_data, order):
    ordered_data = []
    field_dict = {field["name"]: field for field in json_data}
    for field_name in order:
        if field_name in field_dict:
            ordered_data.append(field_dict[field_name])
    for field in json_data:
        if field["name"] not in order:
            ordered_data.append(field)
    return ordered_data


def f_mobj(mobj, sitem):
    filter_args = models.Q()
    model_fields = mobj._meta.get_fields()

    for field in model_fields:
        if field.get_internal_type() in ["CharField", "TextField"]:
            filter_args |= models.Q(**{f"{field.name}__icontains": sitem})
        elif field.get_internal_type() in ["FloatField", "DecimalField"]:
            try:
                sitem = float(sitem)
                filter_args |= models.Q(**{f"{field.name}": sitem})
            except:
                continue
        elif field.get_internal_type() in ["IntegerField"]:
            try:
                sitem = int(sitem)
                filter_args |= models.Q(**{f"{field.name}": sitem})
            except:
                continue
    return mobj.objects.filter(filter_args)

def mf_fields(mobj, fields):
    kk = fields.keys()
    for k in kk:
        fie = mobj._meta.get_field(k)
        if isinstance(fie, models.BooleanField):
            if fields[k] == 'on':
                fields[k] = True
    return fields

