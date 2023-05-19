uiR = {
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
  renderTable: (jsonData) => {
    // Create the table element
    const table = document.createElement('table');
    // Create the table header
    table.classList.add("table");
    table.classList.add("table-bordered");
    table.classList.add("border-primary");
    const thead = document.createElement('thead');
    const headerRow = document.createElement('tr');
    // Get the keys from the first object in the JSON data
    const keys = Object.keys(jsonData[0]);
    // Create the header cells
    keys.forEach(function (key) {
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
      keys.forEach(function (key) {
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
    form.classList.add("row", "gy-2", "gx-3", "align-items-center")

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
    container.appendChild(form);
  },
  searchModel: (element, model_app, model_name, url, minLength = 4) => {
    console.log(element, 'exists right ?');
    element.removeEventListener('input', uiR.searchHandled.bind(null, url, model_app, model_name, minLength));
    element.addEventListener('input', uiR.searchHandled.bind(null, url, model_app, model_name, minLength));
  },
  searchHandled: (url, model_app, model_name, minLength, evt) => {
    sitem = evt.target.value;
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
          console.log(rsp.data);
        }).catch(err => {
          console.log(err);
        })
    }
  }
}

