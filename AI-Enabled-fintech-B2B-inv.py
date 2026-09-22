#!/usr/bin/env python
# coding: utf-8

import warnings
import pandas as pd
from sklearn.model_selection import train_test_split

warnings.filterwarnings('ignore')

def parse_yyyymmdd(value):
    if pd.isna(value):
        return pd.NaT
    try:
        integer = int(value)
        return pd.to_datetime(str(integer), format='%Y%m%d')
    except Exception:
        return pd.to_datetime(value, errors='coerce')

def load_and_prepare_data():
    url = (
        'https://raw.githubusercontent.com/BrijeshYadav001st/HighRadius-csv-file-/'
        'main/H2HBABBA1492.csv'
    )
    data = pd.read_csv(url)

    data.drop(['area_business', 'posting_id'], axis=1, inplace=True, errors='ignore')
    if 'invoice_id' in data.columns:
        data['invoice_id'] = data['invoice_id'].interpolate()

    if 'isOpen' in data.columns:
        data.drop(['isOpen'], axis=1, inplace=True, errors='ignore')

    if 'invoice_currency' in data.columns:
        data['actual_open_amount'] = data['total_open_amount'].where(
            data['invoice_currency'] == 'USD',
            data['total_open_amount'] * 0.8,
        )
        data.drop(['invoice_currency'], axis=1, inplace=True, errors='ignore')
    else:
        data['actual_open_amount'] = data['total_open_amount']

    for col in ['clear_date', 'posting_date', 'due_in_date']:
        if col in data.columns:
            data[col] = data[col].apply(parse_yyyymmdd)

    if 'clear_date' in data.columns and 'due_in_date' in data.columns:
        data['delay_days'] = (data['clear_date'] - data['due_in_date']).dt.days
    else:
        data['delay_days'] = pd.NA

    data.sort_values(by=['posting_date'], inplace=True, ignore_index=True)
    data.drop(['clear_date', 'due_in_date', 'total_open_amount'], axis=1, inplace=True, errors='ignore')

    return data

def main():
    data = load_and_prepare_data()
    print('Loaded data shape:', data.shape)
    print('Columns:', list(data.columns))
    print('Null counts:')
    print(data.isnull().sum())

    if 'delay_days' in data.columns:
        X = data.drop(columns=['delay_days'], errors='ignore')
        y = data['delay_days']

        X_train, X_inter_test, y_train, y_inter_test = train_test_split(
            X,
            y,
            test_size=0.3,
            random_state=0,
            shuffle=False,
        )

        print('Training set shape:', X_train.shape)
        print('Validation set shape:', X_inter_test.shape)
    else:
        print('delay_days column missing; skipping train/test split.')


if __name__ == '__main__':
    main()
