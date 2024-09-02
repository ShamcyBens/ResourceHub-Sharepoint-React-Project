import { Version } from '@microsoft/sp-core-library';
import { IPropertyPaneConfiguration, PropertyPaneTextField } from '@microsoft/sp-property-pane';
import { BaseClientSideWebPart } from '@microsoft/sp-webpart-base';

import styles from './ResourceHubWebPart.module.scss';
import * as strings from 'ResourceHubWebPartStrings';

export interface IResourceHubWebPartProps {
  description: string;
}

export default class ResourceHubWebPart extends BaseClientSideWebPart<IResourceHubWebPartProps> {


  public render(): void {
    this.domElement.innerHTML = `
    <section class="${styles.resourceHub} ${!!this.context.sdks.microsoftTeams ? styles.teams : ''}">
      <div class="${styles.searchContainer}">
        <input type="text" id="searchInput" placeholder="Search..." class="${styles.searchInput}" />
        <button id="searchButton" class="${styles.searchButton}">Search</button>
      </div>
      <div class="${styles.filterContainer}">
        <label><input type="checkbox" class="department-filter" value="Dep1" /> Dep1</label>
        <label><input type="checkbox" class="department-filter" value="Dep2" /> Dep2</label>
        <label><input type="checkbox" class="department-filter" value="Dep3" /> Dep3</label>
        <label><input type="checkbox" class="department-filter" value="Dep4" /> Dep4</label>
      </div>
      <div id="resultsContainer" class="${styles.resultsContainer}">
        <!-- Results will be rendered here -->
      </div>
    </section>`;

    this._setEventHandlers();
  }

  private _setEventHandlers(): void {
    const searchButton = this.domElement.querySelector('#searchButton');
    const departmentFilters = this.domElement.querySelectorAll('.department-filter');

    if (searchButton) {
      searchButton.addEventListener('click', () => this._performSearch());
    }

    departmentFilters.forEach((checkbox) => {
      checkbox.addEventListener('change', () => this._performSearch());
    });
  }

  private _performSearch(): void {
    const searchInputElement = this.domElement.querySelector('#searchInput') as HTMLInputElement;
    const searchInput = searchInputElement ? searchInputElement.value.toLowerCase() : '';
    const selectedDepartments = Array.from(this.domElement.querySelectorAll('.department-filter:checked')).map((input: HTMLInputElement) => input.value);

    // Example data fetching logic (replace with actual data fetching)
    const data = [
      { title: 'Document 1', department: 'Dep1', category: 'CVs' },
      { title: 'Document 2', department: 'Dep2', category: 'Interview Questions' },
      // Add more data as needed
    ];

    const filteredData = data.filter(item => {
      const matchesSearch = item.title.toLowerCase().includes(searchInput);
      const matchesDepartment = selectedDepartments.length === 0 || selectedDepartments.includes(item.department);
      return matchesSearch && matchesDepartment;
    });

    this._renderResults(filteredData);
  }

  private _renderResults(data: Array<{ title: string, department: string, category: string }>): void {
    const resultsContainer = this.domElement.querySelector('#resultsContainer') as HTMLElement;
    if (resultsContainer) {
      resultsContainer.innerHTML = data.map(item => `
        <div class="${styles.resultItem}">
          <h3>${item.title}</h3>
          <p>Department: ${item.department}</p>
          <p>Category: ${item.category}</p>
        </div>
      `).join('');
    }
  }



  protected get dataVersion(): Version {
    return Version.parse('1.0');
  }

  protected getPropertyPaneConfiguration(): IPropertyPaneConfiguration {
    return {
      pages: [
        {
          header: {
            description: strings.PropertyPaneDescription
          },
          groups: [
            {
              groupName: strings.BasicGroupName,
              groupFields: [
                PropertyPaneTextField('description', {
                  label: strings.DescriptionFieldLabel
                })
              ]
            }
          ]
        }
      ]
    };
  }
}
