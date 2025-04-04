# 🧠 CryptoClustering

## 📈 Project Overview

This project applies **unsupervised machine learning** techniques to cluster cryptocurrencies based on market data. The goal is to identify natural groupings using attributes such as daily and weekly price changes, and visualize these clusters to uncover insights about market behavior.

Built for the **Module 19 Challenge**, this project focuses on:
- Feature engineering
- Dimensionality reduction
- K-means clustering
- PCA visualization

## 🧰 Tools & Technologies

- Python
- Pandas
- Scikit-learn
- Plotly
- hvPlot
- Jupyter Notebooks

## 📂 Project Structure

```
CryptoClustering/
├── Crypto_Clustering.ipynb      # Main notebook with all analysis steps
├── crypto_market_data.csv       # Dataset used for clustering
├── Resources/                   # Contains raw and processed data (if any)
└── README.md                    # Project documentation
```

## 🔍 Methodology

1. **Data Preprocessing**
   - Load and clean crypto market data
   - Handle missing values and convert text features to numeric where applicable

2. **Feature Engineering**
   - Focus on `price_change_percentage_24h` and `price_change_percentage_7d`
   - Normalize values

3. **Clustering**
   - Apply **K-Means** clustering
   - Choose optimal number of clusters using the Elbow Method

4. **Dimensionality Reduction**
   - Use **PCA** to reduce to 3 components for visual inspection

5. **Visualization**
   - 2D and 3D scatter plots using `hvPlot` and `Plotly`
   - Cluster label visualizations for interpretation

## 🧪 Results

- Identified **distinct clusters** of cryptocurrencies that share similar behavior over short- and medium-term timeframes
- PCA revealed strong separability, indicating meaningful groupings
- Visualizations provide insights for further market segmentation or investment strategies

## 📈 Example Visualizations

![2D Cluster](https://via.placeholder.com/600x300?text=2D+Cluster+Plot)
![3D PCA](https://via.placeholder.com/600x300?text=3D+PCA+Cluster)

*Replace above placeholders with actual hvPlot/Plotly output screenshots.*

## 🚀 How to Run

1. Clone the repo
```bash
git clone https://github.com/Geo222222/CryptoClustering.git
cd CryptoClustering
```

2. Launch the notebook:
```bash
jupyter notebook Crypto_Clustering.ipynb
```

3. Run all cells to reproduce results.

## 📌 Future Work

- Expand dataset to include volume, market cap, volatility
- Experiment with DBSCAN or Hierarchical Clustering
- Add real-time crypto clustering using API integration

## 📜 License

This project is for academic purposes and experimentation. No commercial license included.

---

**Author:** [Geo222222](https://github.com/Geo222222)  
**Focus:** Data Science • Crypto Markets • ML Engineering

