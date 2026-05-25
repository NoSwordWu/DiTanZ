import json

with open('Zhejiang_shi.geojson', 'r', encoding='utf-8') as f:
    data = json.load(f)

print(f"总features数量: {len(data['features'])}")
print("\n前15个features的详细信息:")
for i, feature in enumerate(data['features'][:15]):
    print(f"\nFeature {i+1}:")
    print(f"  类型: {feature.get('type')}")
    print(f"  几何类型: {feature.get('geometry', {}).get('type')}")
    if 'properties' in feature:
        print(f"  Properties: {feature['properties']}")
    else:
        print("  NO PROPERTIES")
