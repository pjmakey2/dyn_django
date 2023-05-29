uiR = {
  toast: ({ msg, icon = 'success' }) => {
    const Toast = Swal.mixin({
      toast: true,
      position: 'center',
      showConfirmButton: false,
      timer: 3000,
      timerProgressBar: true,
      didOpen: (toast) => {
        toast.addEventListener('mouseenter', Swal.stopTimer)
        toast.addEventListener('mouseleave', Swal.resumeTimer)
      }
    })
    Toast.fire({
      icon: icon,
      title: msg
    })
  },
  renderHTML: (elm, html) => {
    elm.innerHTML = html;
    Array.from(elm.querySelectorAll("script")).forEach(oldScript => {
      const newScript = document.createElement("script");
      Array.from(oldScript.attributes)
        .forEach(attr => newScript.setAttribute(attr.name, attr.value));
      newScript.appendChild(document.createTextNode(oldScript.innerHTML));
      oldScript.parentNode.replaceChild(newScript, oldScript);
    });
  },
  renderTable: ({ jsonData,
    model_app_name,
    model_name,
    wdelete = false,
    wselect = false,
    iname,
    width = '100%',
    height = '600px',
    d_url,
    g_url,
    gcoint,
    ffor = [],
    hiddens = [],
    crname = {}
  }) => {
    // Create the table element
    const table = document.createElement('table');
    idn = `${model_app_name}_${model_name}`;
    table.setAttribute('id', idn);
    // Create the table header
    table.classList.add("table", "table-bordered", "table-sm", "border-primary");
    if (height) {
      table.style.height = height;
    }
    if (width) {
      table.style.width = width;
    }
    table.style['overflow-y'] = 'scroll';
    table.style['overflow-x'] = 'scroll';
    table.style.display = 'block'
    const thead = document.createElement('thead');
    const headerRow = document.createElement('tr');
    // Get the keys from the first object in the JSON data
    const keys = Object.keys(jsonData[0]);
    // Create the header cells
    if ((wselect === true) || (wdelete === true)) {
      const th = document.createElement('th');
      th.appendChild(document.createTextNode('AC'));
      headerRow.appendChild(th);
    }
    keys.forEach(function (key) {
      if (hiddens.includes(key)) return
      if (crname.hasOwnProperty(key)){
        key = crname[key];
      }
      const th = document.createElement('th');
      th.appendChild(document.createTextNode(key));
      headerRow.appendChild(th);
    });
    thead.appendChild(headerRow);
    table.appendChild(thead);
    // Create the table body
    const tbody = document.createElement('tbody');

    // Iterate over each object in the JSON data
    jsonData.forEach(function (obj) {
      const row = document.createElement('tr');
      // Iterate over each key and create the cells
      //actions
      if ((wselect === true) || (wdelete === true)) {
        ac = [];

        if (wdelete === true) {
          jffor = btoa(JSON.stringify(ffor));
          jhiddens = btoa(JSON.stringify(hiddens));
          jcrname = btoa(JSON.stringify(crname));
          ac.push('<button type="button" ' +
          ` onclick="uiR.delete_model('${d_url}', '${g_url}', '${model_app_name}', '${model_name}', ${obj.id}, '${gcoint}', '${width}', '${height}', '${jffor}', '${jhiddens}', '${jcrname}')" ` +
          'class="btn btn-outline-danger">' +
          'DELETE</button>');
        }
        if (wselect === true) {
          vname = obj['name'];
          ac.push('<button type="button" ' +
            ` onclick="uiR.select_model('${model_app_name}', '${model_name}', '${iname}', ${obj.id}, '${vname}')" ` +
            ' class="btn btn-outline-primary">' +
            'SELECT</button>');
        }
        const cell = document.createElement('td');
        cell.innerHTML = ac.join('');
        row.appendChild(cell);
      }
      keys.forEach(function (key) {
        if (hiddens.includes(key)) return
        const cell = document.createElement('td');
        cell.appendChild(document.createTextNode(obj[key]));
        row.appendChild(cell);
      });
      tbody.appendChild(row);
    });
    table.appendChild(tbody);
    // Return the completed table
    return table;
  },
  getCookie: (name) => {
    let cookieValue = null;
    if (document.cookie && document.cookie !== '') {
      const cookies = document.cookie.split(';');
      for (let i = 0; i < cookies.length; i++) {
        const cookie = cookies[i].trim();
        // Does this cookie string begin with the name we want?
        if (cookie.substring(0, name.length + 1) === (name + '=')) {
          cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
          break;
        }
      }
    }
    return cookieValue;
  },
  renderForm: (fid, fdata, containerId) => {
    const container = document.getElementById(containerId);
    container.innerHTML = ''; // Remove existing content

    const form = document.createElement('form');
    form.setAttribute('id', fid);
    form.classList.add("row", "gy-2", "gx-3", "align-items-center");

    fdata.forEach((field) => {
      const { label, type, name, required, readonly, foreignkey, foreignmodel } = field;

      // Create label
      const labelElement = document.createElement('label');
      labelElement.innerHTML = label;

      // Create input element based on field type
      let input;
      if (type === 'hidden') {
        input = document.createElement('input');
        input.setAttribute('type', type);
      }
      else if (type === 'text' || type === 'number') {
        input = document.createElement('input');
        input.setAttribute('type', type);
        input.setAttribute('autocomplete', 'off');
        input.classList.add('form-control')
      } else if (type === 'checkbox') {
        input = document.createElement('input');
        input.setAttribute('type', 'checkbox');
        input.classList.add('form-check-input')
        labelElement.classList.add('form-check-label');
      } else if (type === 'select') {
        input = document.createElement('select');
        input.classList.add('form-select')
      } else if (type === 'textarea') {
        input = document.createElement('textarea');
        input.classList.add('form-control')
      } else if (type === 'image' || type === 'file') {
        input = document.createElement('input');
        input.setAttribute('type', 'file');
        input.classList.add('form-control')
        if (type === 'image') {
          input.setAttribute('accept', 'image/*');
        }
      } else {
        // Unknown field type, skip it
        return;
      }
      if (foreignkey === true) {
        input.setAttribute('foreignmodel', foreignmodel);
      }
      // Set input attributes
      input.setAttribute('name', name);
      if (required) {
        input.setAttribute('required', 'required');
      }
      if (readonly) {
        input.setAttribute('readonly', 'readonly');
      }
      // Append label and input to form

      if (type != 'hidden') {
        let divd = document.createElement('div');
        divd.classList.add('col-auto');
        divd.appendChild(labelElement);
        divd.appendChild(input);
        form.appendChild(divd);
      } else {
        form.appendChild(input);
      }
    });
    // Append form to container
    const btn_s = document.createElement('button');
    // tn = document.createTextNode('Cargar');
    // btn_s.appendChild(tn);
    btn_s.innerHTML = '<i class="bi bi-save"></i>';
    btn_s.classList.add('btn', 'btn-primary', 'mb-3');
    form.appendChild(btn_s);
    container.appendChild(form);
  },
  submitHandle: (d_url,
    g_url,
    model_app_name,
    model_name,
    ffor,
    gcoint,
    width,
    height,
    hiddens,
    crname,
    evt
  ) => {
    evt.preventDefault(); // Prevent the default form submission
    // Get the form data
    const fobj = evt.target
    const formData = new FormData(fobj);
    const data = {};
    // Convert the form data to a JSON object
    for (const [key, value] of formData.entries()) {
      iele = fobj.querySelector(`*[name="${key}"]`);
      if (key === 'id') {
        if (value.trim() === '') { continue }
      }
      if (iele.hasAttribute('data-value') === true) {
        data[key] = iele.getAttribute('data-value')
      } else {
        data[key] = value;
      }
    }
    ffi = new FormData()
    ffi.append('model_app_name', model_app_name);
    ffi.append('model_name', model_name);
    ffi.append('fields', JSON.stringify(data))
    // Send the form data to the server using Axios
    axios.post(d_url, ffi,
      {
        headers: {
          'X-CSRFToken': uiR.getCookie('csrftoken')
        }
      }).then(rda => {
        rsp = rda.data;
        if (rsp.success) {
          uiR.toast({ msg: rsp.success, icon: 'success' })
          fobj.reset();
          uiR.get_lmodel(
            {
              model_app_name: model_app_name,
              model_name: model_name,
              ffor: ffor,
              d_url: d_url,
              g_url: g_url,
              gcoint: gcoint,
              width: width,
              height: height,
              hiddens: hiddens,
              crname: crname
            }
          )
        }
        if (rsp.error) {
          uiR.toast({ msg: rsp.error, icon: 'error' })
        }
      })
      .catch(error => {
        uiR.toast({ msg: error, icon: 'error' })
        console.error(error);
      });
  },
  inptSWord: (evt) => {
    target = evt.target;
    target.select();
  },
  searchModel: ({ element, model_app, model_name, url,
    width = '400px', height = '400px', minLength = 4 }) => {
    element.removeEventListener('input', uiR.searchHandled.bind(null, url, model_app, model_name, width, height, minLength));
    element.addEventListener('input', uiR.searchHandled.bind(null, url, model_app, model_name, width, height, minLength));
    idn = `${model_app}_${model_name}`;
    element.removeEventListener('focusin', uiR.d_floatdiv.bind(null, idn));
    element.addEventListener('focusin', uiR.d_floatdiv.bind(null, idn));
    element.removeEventListener('click', uiR.inptSWord);
    element.addEventListener('click', uiR.inptSWord);
    element.removeEventListener('keyup', uiR.d_floatdiv_k.bind(null, idn));
    element.addEventListener('keyup', uiR.d_floatdiv_k.bind(null, idn));
  },
  searchHandled: (url, model_app, model_name, width, height, minLength, evt) => {
    element = evt.target;
    sitem = element.value;
    wl = sitem.length
    if (wl >= minLength) {
      sdata = new FormData();
      sdata.append('model_app_name', model_app);
      sdata.append('model_name', model_name);
      sdata.append('sitem', sitem);
      axios.post(url, sdata,
        {
          headers: {
            'X-CSRFToken': uiR.getCookie('csrftoken')
          }
        }
      ).then(rsp => {
        data = rsp.data;
        if (data.records.length > 0) {
          const rect = element.getBoundingClientRect();
          const stop = window.scrollY || document.documentElement.scrollTop;
          const sleft = window.scrollX || document.documentElement.scrollLeft;
          const top = rect.top + stop;
          const left = rect.left + sleft;
          const bottom = rect.bottom + stop;
          const right = rect.right + sleft;
          const floatingDiv = uiR.c_floatdiv(
            `${model_app}_${model_name}`,
            width,
            height,
            top + 50,
            bottom,
            right,
            left);
          floatingDiv.innerHTML += uiR.renderTable({
            jsonData: data.records,
            model_app_name: model_app,
            model_name: model_name,
            wselect: true,
            iname: element.name,
            width: width,
            height: 0
          }).outerHTML;
        }

      })
    }
  },
  c_floatdiv: (idn, width, height, top, bottom, right, left) => {
    const div = document.createElement('div');
    div.classList.add(idn);
    div.style.backgroundColor = 'white';
    div.style.position = 'absolute';
    div.style.width = width;
    div.style.height = height;
    div.style.top = top + 'px';
    div.style.right = right + 'px';
    div.style.left = left + 'px';
    div.style.bottom = bottom + 'px';
    div.style.overflow = 'auto';
    div.style.border = '1px solid black';
    os_c = document.getElementById('os_content');
    os_c.innerHTML = '';
    div.innerHTML = `<button onclick="document.querySelector('.${idn}').remove();" class="btn btn-outline-danger">X</button>`;
    os_c.appendChild(div);
    return div;
  },
  d_floatdiv: (idn, evt) => {
    ele = evt.target;
    document.querySelectorAll(`.${idn}`).forEach((ele) => ele.remove());
  },
  d_floatdiv_k: (idn, evt) => {
    ele = evt.target;
    if (evt.key == "Escape") {
      document.querySelectorAll(`.${idn}`).forEach((ele) => ele.remove());
    }
  },
  get_lmodel: ({ model_app_name, model_name, ffor, d_url, g_url, gcoint, width = '100%', height = '600px', hiddens = [], crname = {} }) => {
    ffdata = new FormData();
    ffdata.append('model_app_name', model_app_name);
    ffdata.append('model_name', model_name);
    ffor.forEach(it => {
      ffdata.append('ffields', it);
    })
    return axios.post(g_url,
      ffdata,
      {
        headers: {
          'X-CSRFToken': uiR.getCookie('csrftoken')
        }
      }).then((rsp) => {
        data = rsp.data;
        rr = uiR.renderTable({
          jsonData: data.records,
          model_app_name: model_app_name,
          model_name: model_name,
          wdelete: true,
          d_url: d_url,
          g_url: g_url,
          gcoint: gcoint,
          width: width,
          height: height,
          ffor: ffor,
          hiddens: hiddens,
          crname: crname
        })
        document.querySelector(gcoint)
          .innerHTML = rr.outerHTML;
      })
  },
  formalize_model: ({
    model_app_name,
    model_name,
    fid,
    fcoint,
    d_url,
    q_url,
    g_url,
    ffor,
    gcoint,
    width = '100%',
    height = '600px',
    hiddens = [],
    crname = {},
    mlen = 4
  }) => {
    sdata = new URLSearchParams();
    sdata.append('model_app_name', model_app_name);
    sdata.append('model_name', model_name);
    axios.get(d_url, { params: sdata })
      .then(rsp => {
        uiR.renderForm(fid, rsp.data.mform, fcoint)
        rsp.data.mform.forEach((it) => {
          if (it.foreignkey) {
            uiR.searchModel({
              element: document.querySelector(`#${fid} input[name=${it.name}]`),
              model_app: model_app_name,
              model_name: it.foreignmodel,
              url: q_url,
              minLength: mlen
            })
          }
        })
      }).then(() => {
        ffobj = document.querySelector(`#${fid}`);
        ffobj.addEventListener('submit',
          uiR.submitHandle.bind(
            this,
            d_url,
            g_url,
            model_app_name,
            model_name,
            ffor,
            gcoint,
            width,
            height,
            hiddens,
            crname
          ))
      }).catch(err => {
        uiR.toast({ msg: err, icon: 'error' })
        console.log(err);
      })
  },
  select_model: (model_app_name, model_name, iname, id, vname) => {
    inpte = document.querySelector(`input[name=${iname}]`)
    inpte.value = vname;
    inpte.setAttribute('data-value', id);
    idn = `${model_app_name}_${model_name}`;
    document.querySelectorAll(`.${idn}`).forEach((ele) => ele.remove());
    inpte.focus();
  },
  delete_model: (d_url, g_url, model_app_name, model_name, id, gcoint, width, height, ffor, hiddens, crname) => {
    axios.delete(d_url,
      {
        data: {
          model_app_name: model_app_name,
          model_name: model_name,
          id: id
        },
        headers: {
          'X-CSRFToken': uiR.getCookie('csrftoken')
        }
      }).then(rda => {
        rsp = rda.data;
        if (rsp.success) {
          uiR.toast({ msg: rsp.success, icon: 'success' })
        }
        if (rsp.error) {
          uiR.toast({ msg: rsp.error, icon: 'error' })
        }
      })
      .catch(error => {
        uiR.toast({ msg: error, icon: 'error' })
        console.error(error);
      })
      .finally(() => {
        uiR.get_lmodel(
          {
           model_app_name: model_app_name,
           model_name: model_name,
           ffor: JSON.parse(atob(ffor)),
           d_url: d_url,
           g_url: g_url,
           gcoint: gcoint,
           width: width,
           height: height,
           hiddens: JSON.parse(atob(hiddens)),
           crname: JSON.parse(atob(crname)),
          }
        )
      });
  }
}

