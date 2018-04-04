import { Component, OnInit } from '@angular/core';
import { TreeviewItem, TreeviewConfig } from 'ngx-treeview';

@Component({
  selector: 'cta-cuentas-sin-clasificar-edit',
  templateUrl: './cuentas-sin-clasificar-edit.component.html',
  styleUrls: ['./cuentas-sin-clasificar-edit.component.scss']
})
export class CuentasSinClasificarEditComponent implements OnInit {

  buttonClass: string = 'btn-outline-primary';
  items: TreeviewItem[];
  config = TreeviewConfig.create({
    hasAllCheckBox: true,
    hasFilter: true,
    hasCollapseExpand: true,
    decoupleChildFromParent: false,
    maxHeight: 300
  });

  constructor() { }

  ngOnInit() {
    this.fillTree();
    // this.items = this.getProducts();
  }

  onSelectedChange(event) {
    console.log(event);
  }

  fillTree() {
    this.items = [new TreeviewItem(
        {
          text: 'ANDRADE UNIVERSIDAD SA DE CV', value: 1, collapsed: true, children: [
            { text: 'Universidad', value: 11, checked: false },
            { text: 'Cuautitlan', value: 12, checked: false },
            { text: 'Pedregal', value: 13, checked: false }
          ]
        }),
        new TreeviewItem({
          text: 'ANGAR SATELITE SA DE CV', value: 2, collapsed: true, children: [
            { text: 'Satélite', value: 21, checked: false },
            { text: 'Esmeralda', value: 22, checked: false },
            { text: 'Pedregal', value: 23, checked: false }
          ]
        }),
        new TreeviewItem({
          text: 'ZARAGOZA MOTRIZ SA DE CV', value: 3, collapsed: true, children: [
            { text: 'Zaragoza', value: 31, checked: false },
            { text: 'Aeropuerto', value: 32, checked: false },
            { text: 'Abasto', value: 33, checked: false },
            { text: 'FAerea', value: 34, checked: false },
            { text: 'Cuahutemoc', value: 35, checked: false }
          ]
        })
    ];
  }

  getProducts(): TreeviewItem[] {
    const fruitCategory = new TreeviewItem({
        text: 'Fruit', value: 1, children: [
            { text: 'Apple', value: 11 },
            { text: 'Mango', value: 12 }
        ]
    });
    const vegetableCategory = new TreeviewItem({
        text: 'Vegetable', value: 2, children: [
            { text: 'Salad', value: 21 },
            { text: 'Potato', value: 22 }
        ]
    });
    // fruitCategory.setCollapsedRecursive(true);
    vegetableCategory.children.push(new TreeviewItem({ text: 'Mushroom', value: 23, checked: false }));
    vegetableCategory.correctChecked(); // need this to make 'Vegetable' node to change checked value from true to false
    return [fruitCategory, vegetableCategory];
}

}
