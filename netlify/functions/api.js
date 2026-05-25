import { connectLambda, getStore } from '@netlify/blobs';

const STORE_NAME = 'projects_data';

async function handleOptions() {
  return {
    statusCode: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
    body: '',
  };
}

async function handleGetProjects() {
  try {
    const store = getStore({ name: STORE_NAME });
    const result = await store.get('projects');
    if (result) {
      return {
        statusCode: 200,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        },
        body: result,
      };
    } else {
      return {
        statusCode: 404,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        },
        body: JSON.stringify({ error: 'No data found' }),
      };
    }
  } catch (error) {
    return {
      statusCode: 500,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
      body: JSON.stringify({ error: error.message }),
    };
  }
}

async function handleSaveProjects(event) {
  try {
    const body = JSON.parse(event.body);
    const store = getStore({ name: STORE_NAME });
    await store.set('projects', JSON.stringify(body));
    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
      body: JSON.stringify({ success: true, message: 'Data saved successfully' }),
    };
  } catch (error) {
    return {
      statusCode: 500,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
      body: JSON.stringify({ error: error.message }),
    };
  }
}

async function handleDeleteProjects() {
  try {
    const store = getStore({ name: STORE_NAME });
    await store.delete('projects');
    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
      body: JSON.stringify({ success: true, message: 'Data deleted successfully' }),
    };
  } catch (error) {
    return {
      statusCode: 500,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
      body: JSON.stringify({ error: error.message }),
    };
  }
}

export async function handler(event) {
  connectLambda(event);
  
  const { httpMethod, path } = event;

  if (httpMethod === 'OPTIONS') {
    return handleOptions();
  }

  const pathParts = path.replace('/api/', '').split('/');
  const resource = pathParts[0];

  if (resource === 'projects') {
    switch (httpMethod) {
      case 'GET':
        return handleGetProjects();
      case 'POST':
        return handleSaveProjects(event);
      case 'DELETE':
        return handleDeleteProjects();
      default:
        return {
          statusCode: 405,
          headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
          },
          body: JSON.stringify({ error: 'Method not allowed' }),
        };
    }
  }

  return {
    statusCode: 404,
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
    },
    body: JSON.stringify({ error: 'Resource not found' }),
  };
}