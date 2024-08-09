import { render, fireEvent, waitFor } from "@testing-library/react";
import Home from "@/app/page";

global.fetch = jest.fn();

describe('evaluate', () => {

    it('should display evaluate ui', async () => {
        const { getByText } = await render(<Home />);
        expect(getByText('Evaluate')).toBeInTheDocument();
    })

    it('should evaluate response for a defined GitHub user and repo', async () => {
        // Mock the fetch response
        global.fetch.mockResolvedValueOnce({
          json: () => Promise.resolve({ results: [{ language: 'javascript', classification: 'intermediate', elements: ['async/await', 'Promise'] }] }),
        });
    
        const { getByText, getByLabelText } = await render(<Home />);
        
        // Fill in the form fields
        fireEvent.change(getByLabelText('GitHub Username'), { target: { value: 'octocat' } });
        fireEvent.change(getByLabelText('GitHub Repository'), { target: { value: 'Hello-World' } });
        
        // Select a language (optional, as it's not required in the current implementation)
        // If you want to test language selection, you'd need to mock the Autocomplete component or use a more complex testing strategy
    
        // Submit the form
        fireEvent.click(getByText('Evaluate'));
    
        // Wait for the result to be displayed
        await waitFor(() => {
          expect(fetch).toHaveBeenCalledWith('/api/evaluate/?owner=octocat&repo=Hello-World&language=undefined');
        });
    
        // In the current implementation, the result is only logged to the console
        // To make this test more meaningful, you should update the Home component to display the result
        // Then, you can add an expectation like this:
        // expect(getByText('Classification: intermediate')).toBeInTheDocument();
    });

})