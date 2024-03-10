import requests

API_URL = "https://api-inference.huggingface.co/models/cardiffnlp/twitter-roberta-base-sentiment-latest"
headers = {"Authorization": "Bearer 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"}

def evaluate_answer(question, answer, rubrics):
    # Prepare the payload
    payload = {
        "text": answer,  # Pass the answer as the 'text' parameter
        "rubrics": rubrics
    }

    # Send a POST request to the Hugging Face Inference API
    response = requests.post(API_URL, json=payload, headers=headers)

    # Process the response
    if response.status_code == 200:
        result = response.json()
        return result
    else:
        print("Error:", response.text)
        return None

# Example usage
if __name__ == "__main__":
    # Sample question
    question = "What is the capital of France?"

    # Sample answer
    answer = "The capital of France is Paris."

    # Sample rubrics with criteria description and allocated marks
    rubrics = {
        "clarity": {"description": "Clear and concise", "marks": 5},
        "accuracy": {"description": "Correct information", "marks": 10},
        "relevance": {"description": "Addresses the question directly", "marks": 7}
    }

    # Evaluate the answer based on rubrics
    evaluation_result = evaluate_answer(question, answer, rubrics)
    print("Evaluation Result:", evaluation_result)