
import pandas as pd
import json

def load_data(excel_path):
    return pd.read_excel(excel_path)

def handle_nan(value):
    return None if pd.isna(value) else value

def convert_to_json(data):
    if 'birthday' in data.columns and data['birthday'].notna().any():
        data['birthday'] = pd.to_datetime(data['birthday'], errors='coerce').dt.strftime('%Y-%m-%d').where(data['birthday'].notnull(), None)
    else:
        # 如果'出生日期'列不存在或全为空，创建一个全为None的列
        data['birthday'] = None
    # data['birthday'] = data['birthday'].dt.strftime('%Y-%m-%d').where(data['birthday'].notnull(), None)
    data.fillna(value={'parentID': 0}, inplace=True)
    records = data.to_dict(orient='records')

    # Initialize parent_mapping with an empty list for each parent ID
    parent_mapping = {record['ID']: [] for record in records}
    parent_mapping[0] = []  # Add a root entry

    for record in records:
        # Handle NaN for the '照片' column
        record['pic'] = handle_nan(record['pic'])
        record['parentID'] = handle_nan(record['parentID'])
        parent_id = record['parentID']
        if parent_id in parent_mapping:
            parent_mapping[parent_id].append(record)

    def build_hierarchy(record_id):
        # Skip records that are not found (e.g., parent ID without a matching record)
        if record_id not in parent_mapping:
            return None
        member_list = parent_mapping[record_id]
        member_hierarchy = []
        for member in member_list:
            children = build_hierarchy(member['ID'])
            member_info = {k: v for k, v in member.items() if k not in ['ID', 'parentID']}
            if children:
                member_info['children'] = children
            member_hierarchy.append(member_info)
        return member_hierarchy

    # Start the hierarchy with the root node(s)
    return build_hierarchy(0)

def save_json(data, output_path):
    with open(output_path, 'w', encoding='utf-8') as f:
        json.dump(data, f, ensure_ascii=False, indent=2)

def main():
    input_path = r"C:\Users\11537\Downloads\电子族谱数据库_样例_数据表 (1).xlsx"  # Replace with the path to your Excel file
    output_path = 'family_tree.json'  # The JSON output file name

    excel_data = load_data(input_path)
    hierarchy_json = convert_to_json(excel_data)
    save_json(hierarchy_json, output_path)
    print(f'JSON saved to {output_path}')

if __name__ == '__main__':
    main()

