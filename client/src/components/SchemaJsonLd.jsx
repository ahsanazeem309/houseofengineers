import React, { useState, useEffect } from 'react';

/**
 * Injects Schema.org structured data (JSON-LD) into the document <head>
 * Automatically cleans up upon component unmount
 */
export default function SchemaJsonLd({ schema, id = 'dynamic-schema-jsonld' }) {
  useEffect(() => {
    if (!schema) return;

    let script = document.getElementById(id);
    if (!script) {
      script = document.createElement('script');
      script.id = id;
      script.type = 'application/ld+json';
      document.head.appendChild(script);
    }

    try {
      script.textContent = typeof schema === 'string' ? schema : JSON.stringify(schema);
    } catch (err) {
      console.warn('[SchemaJsonLd] Serialization error:', err);
    }

    return () => {
      const el = document.getElementById(id);
      if (el) {
        el.remove();
      }
    };
  }, [schema, id]);

  return null;
}

/**
 * Automatically loads & injects the Global Organization / LocalBusiness JSON-LD
 */
export function GlobalOrganizationSchema() {
  const [globalSchema, setGlobalSchema] = useState(null);

  useEffect(() => {
    fetch('/api/content/schema')
      .then(r => r.json())
      .then(d => {
        if (d.success && d.schema?.organization && d.schema.organization.enabled) {
          const org = d.schema.organization;
          const jsonLd = {
            '@context': 'https://schema.org',
            '@type': org.schemaType || 'LocalBusiness',
            '@id': `${org.url || 'https://houseofengineers.pk'}#organization`,
            'name': org.name,
            'legalName': org.legalName,
            'url': org.url,
            'logo': org.logo,
            'description': org.description,
            'telephone': org.telephone,
            'email': org.email,
            'address': {
              '@type': 'PostalAddress',
              ...org.address
            },
            'geo': {
              '@type': 'GeoCoordinates',
              'latitude': org.geo?.latitude,
              'longitude': org.geo?.longitude
            },
            'sameAs': org.sameAs || []
          };
          setGlobalSchema(jsonLd);
        }
      })
      .catch(() => {});
  }, []);

  if (!globalSchema) return null;
  return <SchemaJsonLd schema={globalSchema} id="global-organization-jsonld" />;
}
