from django.forms import model_to_dict


def get_modelfield(instance, field):
    field_path = field.split('__')
    lfp = len(field_path)
    if len(field_path) > 1:
        attr = field_path[-1]
        for idx, fattr in enumerate(field_path):
            if idx+1==lfp:
                if not instance: return None
                attr = getattr(instance, attr)
                if getattr(attr, 'im_func', None):
                    return attr()
                return attr
            if not instance: return None
            instance = getattr(instance, fattr)
    attr = getattr(instance, field)
    if getattr(attr, 'im_func', None):
        return attr()
    return attr

def sfields(mobj, sfields, fields, normalize=[]):
    if fields:
        x = model_to_dict(mobj, fields=fields)
    else:
        x = model_to_dict(mobj)
    for hf in  filter(lambda x: x.endswith('_id'), fields):
        x[hf] = getattr(mobj, hf)
    x['pk'] = mobj.pk
    x['id'] = mobj.pk
    for ff in sfields:
        value = get_modelfield(mobj, ff)
        x[ff] = value
    if normalize:
        return snormalize(x, sfields+fields, normalize)
    return x

def snormalize(x, keys, normalize):
    xt = {}
    for norm, k in zip(normalize, keys):
        xt[norm] = x[k]
    return xt