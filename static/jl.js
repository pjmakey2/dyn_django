uiR = {
    renderHTML: (elm, html)=> {
        elm.innerHTML = html;
        Array.from(elm.querySelectorAll("script")).forEach( oldScript => {
            const newScript = document.createElement("script");
            Array.from(oldScript.attributes)
            .forEach( attr => newScript.setAttribute(attr.name, attr.value) );
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
        keys.forEach(function(key) {
          const th = document.createElement('th');
          th.appendChild(document.createTextNode(key));
          headerRow.appendChild(th);
        });
        thead.appendChild(headerRow);
        table.appendChild(thead);
        // Create the table body
        const tbody = document.createElement('tbody');
        // Iterate over each object in the JSON data
        jsonData.forEach(function(obj) {
          const row = document.createElement('tr');
          // Iterate over each key and create the cells
          keys.forEach(function(key) {
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
    }
}