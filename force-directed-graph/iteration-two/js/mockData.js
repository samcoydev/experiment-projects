const citiesData = {
    "nodes": [
        {"id": 0, "data": "New York", "colorGroupIndex": 0},
        {"id": 1, "data": "Los Angeles", "colorGroupIndex": 0},
        {"id": 2, "data": "Chicago", "colorGroupIndex": 0},
        {"id": 3, "data": "San Francisco", "colorGroupIndex": 1},
        {"id": 4, "data": "Seattle", "colorGroupIndex": 1},
        {"id": 5, "data": "Miami", "colorGroupIndex": 2},
        {"id": 6, "data": "Dallas", "colorGroupIndex": 2},
        {"id": 7, "data": "Denver", "colorGroupIndex": 2}
    ],
    "edges": [
        {"source": 0, "target": 1},
        {"source": 1, "target": 2},
        {"source": 2, "target": 0},
        {"source": 2, "target": 3},
        {"source": 3, "target": 4},
        {"source": 4, "target": 3},
        {"source": 5, "target": 6},
        {"source": 6, "target": 7}
    ]
}

const familyData = {
    "nodes": [
        {
            "id": 0, "data": "Grandparent", "colorGroupIndex": 0
        },
        {
            "id": 1, "data": "Parent 1", "colorGroupIndex": 1
        },
        {
            "id": 2, "data": "Parent 2", "colorGroupIndex": 2
        },
        {
            "id": 3, "data": "Child 1", "colorGroupIndex": 3
        },
        {
            "id": 4,
            "data": "Child 2",
            "colorGroupIndex": 3
        },
        {
            "id": 5,
            "data": "Grandchild",
            "colorGroupIndex": 4
        }
    ],
    "edges": [
        {
            "source": 0,
            "target": 1
        },
        {
            "source": 0,
            "target": 2
        },
        {
            "source": 1,
            "target": 3
        },
        {
            "source": 1,
            "target": 4
        },
        {
            "source": 3,
            "target": 5
        }
    ]
}

const namesData = {
    "nodes": [
        {"id": 0, "data": "Alice", "colorGroupIndex": 0},
        {"id": 1, "data": "Bob", "colorGroupIndex": 0},
        {"id": 2, "data": "Charlie", "colorGroupIndex": 0},
        {"id": 3, "data": "David", "colorGroupIndex": 1},
        {"id": 4, "data": "Eve", "colorGroupIndex": 1},
        {"id": 5, "data": "Frank", "colorGroupIndex": 2},
        {"id": 6, "data": "Grace", "colorGroupIndex": 2},
        {"id": 7, "data": "Hannah", "colorGroupIndex": 2}
    ],
    "edges": [
        {"source": 0, "target": 1},
        {"source": 1, "target": 2},
        {"source": 2, "target": 0},
        {"source": 2, "target": 3},
        {"source": 3, "target": 4},
        {"source": 4, "target": 3},
        {"source": 5, "target": 6},
        {"source": 6, "target": 7}
    ]
}

const recipesData = {
    "nodes": [
        {"id": 0, "data": "Pasta Carbonara", "colorGroupIndex": 0},
        {"id": 1, "data": "Chicken Curry", "colorGroupIndex": 0},
        {"id": 2, "data": "Vegetable Stir-Fry", "colorGroupIndex": 0},
        {"id": 3, "data": "Chocolate Cake", "colorGroupIndex": 1},
        {"id": 4, "data": "Salmon Fillet", "colorGroupIndex": 1},
        {"id": 5, "data": "Tiramisu", "colorGroupIndex": 2},
        {"id": 6, "data": "Burger", "colorGroupIndex": 2},
        {"id": 7, "data": "Sushi Roll", "colorGroupIndex": 2}
    ],
    "edges": [
        {"source": 0, "target": 1},
        {"source": 1, "target": 2},
        {"source": 2, "target": 0},
        {"source": 2, "target": 3},
        {"source": 3, "target": 4},
        {"source": 4, "target": 3},
        {"source": 5, "target": 6},
        {"source": 6, "target": 7}
    ]
}
