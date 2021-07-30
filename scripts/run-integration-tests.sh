#! /bin/bash
echo "Running integration tests."
docker exec workspace_signout_1 npm test || exit 1
if [ "$?" != 0 ]; then
    echo "Integration tests failed."
    exit 1
fi
echo "Test ran sucessfully."