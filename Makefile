format:
	clang-format -i  shaders/examples/bin/data/shadersGL2/*.frag
check_format:
	clang-format --dry-run --Werror   shaders/examples/bin/data/shadersGL2/*.frag
