# ANSI color codes
RESET = \033[0m
GREEN = \033[32m
YELLOW = \033[33m
BLUE = \033[34m
RED = \033[31m

# Define project constants
DENO_FLAGS = task dev
LOCK_FILE = deno.lock
DEPS_FILE = deps.ts
# Settings for testing dict func
DENO_DANGEROUS_FLAG = -A
DICT_PATH=./utils
DICT_FILE=dict_pattern.ts
DFA=dict_dfa.ts
# Default target: Show available commands
.PHONY: help
help:
	@echo -e "${BLUE}Available commands:${RESET}"
	@echo -e "  ${GREEN}make run${RESET}           - Run the Deno project"
	@echo -e "  ${GREEN}make fmt${RESET}           - Format the code"
	@echo -e "  ${GREEN}make lint${RESET}          - Lint the code"
	@echo -e "  ${GREEN}make cache${RESET}         - Cache and lock dependencies"
	@echo -e "  ${GREEN}make check${RESET}         - Check for errors (lint + fmt check)"
	@echo -e "  ${GREEN}make clean${RESET}         - Clean Deno cache"
	@echo -e "  ${GREEN}make test${RESET}           - Test the functionality of dictionary"

# Target to run the project
.PHONY: run
run:
	@echo -e "${YELLOW}Running the Deno project...${RESET}"
	@deno run $(DENO_FLAGS) main.ts
	@echo -e "${GREEN}Project ran successfully!${RESET}"

# Format the code
.PHONY: fmt
fmt:
	@echo -e "${YELLOW}Formatting code...${RESET}"
	@deno fmt
	@echo -e "${GREEN}Code formatted successfully!${RESET}"

# Lint the code
.PHONY: lint
lint:
	@echo -e "${YELLOW}Linting code...${RESET}"
	@deno lint
	@echo -e "${GREEN}Code linted successfully!${RESET}"

# Cache dependencies and lock them into the lock file
.PHONY: cache
cache:
	@echo -e "${YELLOW}Caching and locking dependencies...${RESET}"
	@deno cache -r --lock=$(LOCK_FILE) $(DEPS_FILE)
	@echo -e "${GREEN}Dependencies cached and locked successfully!${RESET}"

# Lint and format check combined
.PHONY: check
check: fmt lint

# Clean Deno cache
.PHONY: clean
clean:
	@echo -e "${YELLOW}Cleaning Deno cache...${RESET}"
	@deno cache --reload
	@echo -e "${GREEN}Cache cleaned successfully!${RESET}"

# test functionality
.PHONY: test
test:
	@echo -e "${YELLOW}Testing Dictionary funcs${RESET}"
	@echo ""
	@deno run ${DENO_DANGEROUS_FLAG} "${DICT_PATH}/${DICT_FILE}"
.PHONY: dfa
dfa:
	@echo -e "${YELLOW}Testing Dictionary funcs${RESET}"
	@echo ""
	@deno run ${DENO_DANGEROUS_FLAG} "${DICT_PATH}/${DFA}"

