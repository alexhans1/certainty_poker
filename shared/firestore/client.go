package firestore

import (
	"context"

	"cloud.google.com/go/firestore"
)

type FirestoreClient struct {
	client *firestore.Client
}

// NewFirestoreClient initializes a new FirestoreClient instance
func NewFirestoreClient(ctx context.Context, projectID string) (*FirestoreClient, error) {
	client, err := firestore.NewClient(ctx, projectID)
	if err != nil {
		return nil, err
	}
	return &FirestoreClient{client: client}, nil
}

// Close cleans up the Firestore client
func (fc *FirestoreClient) Close() {
	if fc.client != nil {
		fc.client.Close()
	}
}

// GetDocumentByID retrieves a document by ID from a specific collection
func (fc *FirestoreClient) GetDocumentByID(ctx context.Context, collection string, id string) (*firestore.DocumentSnapshot, error) {
	docRef := fc.client.Collection(collection).Doc(id)
	return docRef.Get(ctx)
}

// UpdateDocument updates a specific document in Firestore
func (fc *FirestoreClient) UpdateDocument(ctx context.Context, collection string, id string, data map[string]interface{}) error {
	_, err := fc.client.Collection(collection).Doc(id).Set(ctx, data, firestore.MergeAll)
	return err
}

// DeleteDocument deletes a document from a specific collection
func (fc *FirestoreClient) DeleteDocument(ctx context.Context, collection string, id string) error {
	_, err := fc.client.Collection(collection).Doc(id).Delete(ctx)
	return err
}

// Collection provides access to a Firestore collection
func (fc *FirestoreClient) Collection(collection string) *firestore.CollectionRef {
	return fc.client.Collection(collection)
}
