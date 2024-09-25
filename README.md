# TravelTracker
A web application to display historical travel grouped by users.  Users can decide what other users to share their travel with

![alt text](media/Image.png)


Requirements for the deploy script at this base level of the project are
<ul>
    <li>Run on a system that can execute Bash</li>
    <li>Have a separate system that is running RHEL and has podman installed</li>
    <li>Create a .env file at this base level in the project</li>
    <li>
        Two entries are required to be in the .env file
        <ul>
            <li>DEV_SERVER with a value of the hostname or IP of the linux server</li>
            <li>DEV_SERVER_USER with a value of a user on the linux server that is on the wheel group</li>
        </ul>
    </li>
    <li>To make the deployment process easier, ssh keys should be shared between the deployment server and the development server using the development user and visudo should be set to not require a password for users in the wheel group to elevate priviledges</li>
</ul>
<hr/>
Requirements for the travel-ux project are the following
<ul>
    <li>Create a .env file at the base directory of travel-ux project</li>
    <li>Create an account with Ion Cesisum and obtain an API Key</li>
    <li>Add the following entries in the .env file at the base directory of the travel-ux project
        <ul>
            <li>REACT_APP_ION_ACCESS_TOKEN with a value of the API key from ION</li>
            <li>REACT_APP_API_BASE with a value of http://{your development server hostname or IP address}:8080</li>
        </ul>
    </li>

</ul>