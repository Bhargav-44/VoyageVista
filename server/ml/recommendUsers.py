import pandas as pd
from sklearn.preprocessing import OneHotEncoder
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
from sklearn.neighbors import NearestNeighbors

# 1. Feature Engineering
def engineer_features(users):
    df = pd.DataFrame(users)
    
    df['name'] = df['name'].astype(str)
    
    # One-hot encode categorical features
    cat_features = ['style', 'budget']
    encoder = OneHotEncoder(sparse=False, handle_unknown='ignore')
    encoded = encoder.fit_transform(df[cat_features].fillna(''))
    encoded_df = pd.DataFrame(encoded, columns=encoder.get_feature_names_out(cat_features))
    
    # TF-IDF on bio
    tfidf_bio = TfidfVectorizer(max_features=100)
    bio_tfidf = tfidf_bio.fit_transform(df['bio'].fillna(''))
    bio_df = pd.DataFrame(bio_tfidf.toarray(), columns=tfidf_bio.get_feature_names_out())

    # TF-IDF on journal contents
    def get_journal_contents(journals):
        return ' '.join([journal.get('content', '') for journal in journals]) if isinstance(journals, list) else ''

    df['journal_contents'] = df['journals'].apply(get_journal_contents)
    tfidf_journal = TfidfVectorizer(max_features=100)
    journal_tfidf = tfidf_journal.fit_transform(df['journal_contents'])
    journal_df = pd.DataFrame(journal_tfidf.toarray(), columns=tfidf_journal.get_feature_names_out())
    
    # Other numerical features
    df['followers_count'] = df['followers'].apply(lambda x: len(x) if isinstance(x, list) else 0)
    df['following_count'] = df['following'].apply(lambda x: len(x) if isinstance(x, list) else 0)
    df['posts_count'] = df['posts'].apply(lambda x: len(x) if isinstance(x, list) else 0)
    df['lists_count'] = df['list'].apply(lambda x: len(x) if isinstance(x, list) else 0)
    df['tags_count'] = df['tags'].apply(lambda x: len(x) if isinstance(x, list) else 0)
    
    # Combine all features
    feature_df = pd.concat([
        df[['name']],
        encoded_df, 
        bio_df,
        journal_df,
        df[['followers_count', 'following_count', 'posts_count', 'lists_count', 'tags_count']]
    ], axis=1)
    
    return feature_df

# 2. & 3. Similarity and KNN
def get_recommendations(user_name, users, k=5):
    feature_df = engineer_features(users)
    # print(feature_df.columns)
    # print(feature_df)
    
    # Find the index of the current user by name
    user_row = feature_df[feature_df['name'] == user_name]
    if user_row.empty:
        raise ValueError(f"User '{user_name}' not found in the dataset")
    
    user_index = user_row.index[0]
    
    # Compute cosine similarity
    similarity = cosine_similarity(feature_df.drop('name', axis=1))  # Exclude 'name' from similarity calculation
    
    # Adjust k if it's larger than the number of available users
    n_samples = len(users)
    k = min(k, n_samples - 1) 
    
    if k < 1:
        return [] 
    
    # Use KNN to find similar users
    knn = NearestNeighbors(n_neighbors=k+1, metric='precomputed')
    # print(similarity)
    knn.fit(abs(1 - similarity))  # Convert similarity to distance
    
    distances, indices = knn.kneighbors(abs(1 - similarity[user_index]).reshape(1, -1))
    
    # Get the similar users (excluding the user themselves)
    similar_users = [users[i] for i in indices.flatten()[1:]]
    
    return similar_users

