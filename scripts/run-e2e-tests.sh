#! /bin/bash
echo "Running e2e tests."
docker exec workspace_signout_1 npm run test-e2e || exit 1
if [ "$?" != 0 ]; then
    echo "E2e tests failed."
    exit 1
fi
echo "Test ran sucessfully."