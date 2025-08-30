package main

import (
	"encoding/json"
	"fmt"
	"io"
	"log"
	"net/http"
	"time"

	mcp_golang "github.com/metoro-io/mcp-golang"
	"github.com/metoro-io/mcp-golang/transport/stdio"
)

type Content struct {
	Title       string  `json:"title" jsonschema:"required,description=The title to submit"`
	Description *string `json:"description" jsonschema:"description=Optional description"`
}

type HelloArgs struct {
	Submitter string  `json:"submitter" jsonschema:"required,description=Who is submitting"`
	Content   Content `json:"content" jsonschema:"required,description=The content to submit"`
}

type BitcoinPriceArguments struct {
	Currency string `json:"currency" jsonschema:"description=Currency code for Bitcoin price (e.g., USD, EUR)"`
}

type CoinGeckoResponse struct {
	Bitcoin struct {
		USD float64 `json:"usd"`
		EUR float64 `json:"eur"`
		GBP float64 `json:"gbp"`
		JPY float64 `json:"jpy"`
		AUD float64 `json:"aud"`
		CAD float64 `json:"cad"`
		CHF float64 `json:"chf"`
		CNY float64 `json:"cny"`
		KRW float64 `json:"krw"`
		RUB float64 `json:"rub"`
	} `json:"bitcoin"`
}

func main() {
	log.Println("Starting MCP Server...")
	server := mcp_golang.NewServer(stdio.NewStdioServerTransport())

	// Tools
	err := server.RegisterTool("hello-world", "Say hello to a person with a personalized greeting message", hello_world)
	if err != nil {
		log.Fatalf("Error registering hello-world tool: %v", err)
	}

	err = server.RegisterTool("bitcoin_price", "Get the latest Bitcoin price in various currencies", bitcoin_price)
	if err != nil {
		log.Fatalf("Error registering bitcoin-price tool: %v", err)
	}

	// Prompts
	err = server.RegisterPrompt("prompt_test", "This is a test prompt", prompt_test)
	if err != nil {
		log.Fatalf("Error registering prompt_test: %v", err)
	}

	// Resources
	err = server.RegisterResource("test://resource", "resource_test", "This is a test resource", "application/json", resource_test)
	if err != nil {
		log.Fatalf("Error registering resource: %v", err)
	}

	log.Println("MCP Server is now running and waiting for requests...")
	if err := server.Serve(); err != nil {
		log.Fatalf("Error running MCP server: %v", err)
	}

	select {} // Keeps the server running
}

// ---- Tools ----
func hello_world(arguments HelloArgs) (*mcp_golang.ToolResponse, error) {
	log.Println("Received request for hello tool")
	return mcp_golang.NewToolResponse(mcp_golang.NewTextContent(fmt.Sprintf("Hello, %s! Welcome to the MCP Example.", arguments.Submitter))), nil
}

func bitcoin_price(arguments BitcoinPriceArguments) (*mcp_golang.ToolResponse, error) {
	log.Printf("Received request for bitcoin_price tool with currency: %s", arguments.Currency)

	currency := arguments.Currency
	if currency == "" {
		currency = "USD"
	}

	price, err := get_price(currency)
	if err != nil {
		return mcp_golang.NewToolResponse(mcp_golang.NewTextContent(fmt.Sprintf("Error fetching Bitcoin price: %v", err))), nil
	}

	return mcp_golang.NewToolResponse(mcp_golang.NewTextContent(fmt.Sprintf("The current Bitcoin price is %.2f %s (as of %s)",
		price,
		currency,
		time.Now().Format(time.RFC1123)))), nil
}

// helper
func get_price(currency string) (float64, error) {
	client := &http.Client{Timeout: 10 * time.Second}

	resp, err := client.Get("https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=usd,eur,gbp,jpy,aud,cad,chf,cny,krw,rub")
	if err != nil {
		return 0, fmt.Errorf("error making request to CoinGecko API: %w", err)
	}
	defer resp.Body.Close()

	body, err := io.ReadAll(resp.Body)
	if err != nil {
		return 0, fmt.Errorf("error reading response body: %w", err)
	}

	response := CoinGeckoResponse{}
	err = json.Unmarshal(body, &response)
	if err != nil {
		return 0, fmt.Errorf("error parsing JSON response: %w", err)
	}

	var price float64
	switch currency {
	case "USD", "usd":
		price = response.Bitcoin.USD
	case "EUR", "eur":
		price = response.Bitcoin.EUR
	case "GBP", "gbp":
		price = response.Bitcoin.GBP
	case "JPY", "jpy":
		price = response.Bitcoin.JPY
	case "AUD", "aud":
		price = response.Bitcoin.AUD
	case "CAD", "cad":
		price = response.Bitcoin.CAD
	case "CHF", "chf":
		price = response.Bitcoin.CHF
	case "CNY", "cny":
		price = response.Bitcoin.CNY
	case "KRW", "krw":
		price = response.Bitcoin.KRW
	case "RUB", "rub":
		price = response.Bitcoin.RUB
	default:
		return 0, fmt.Errorf("unsupported currency: %s", currency)
	}

	return price, nil
}

// ---- Prompts ----
func prompt_test(arguments Content) (*mcp_golang.PromptResponse, error) {
	log.Println("Received request for prompt_test")
	return mcp_golang.NewPromptResponse("description", mcp_golang.NewPromptMessage(mcp_golang.NewTextContent(fmt.Sprintf("Hello, %s!", arguments.Title)), mcp_golang.RoleUser)), nil
}

// ---- Resources ----
func resource_test() (*mcp_golang.ResourceResponse, error) {
	log.Println("Received request for resource: test://resource")
	return mcp_golang.NewResourceResponse(mcp_golang.NewTextEmbeddedResource(
		"test://resource", "This is a test resource", "application/json",
	)), nil
}
