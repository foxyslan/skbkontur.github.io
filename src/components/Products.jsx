import React from 'react';
import Helmet from 'react-helmet';

import socialMetaHeaders from '../models/social-meta-headers';
import metaHeaders from '../models/meta-headers';

export default function Products({ route: { products } }) {
    return (
        <main className="block-container">
            <div className="blocks fixed-width-content">
                <Helmet
                    title={products.title}
                    meta={[
                        ...products.customMetaHeaders,
                        ...metaHeaders(products.meta),
                        ...socialMetaHeaders(products.title, products.meta.description),
                    ]}
                />
                <div className="row">
                    {products.blocks.map((block, index) => (
                        <div key={index} className="block-wrapper col-lg-4 col-md-6 col-sm-6 col-xs-12">
                            <article className="block">
                                {block.image &&
                                    <div className="image"><img src={block.image} /></div>
                                }
                                <div className="content">
                                    <h3>
                                        <a href={block.header.href}>{block.header.caption}</a>
                                    </h3>
                                    <div className="text">
                                        {block.text}
                                    </div>
                                    <div className="links">
                                        {block.links.map((link, index) => (
                                            <a key={index} href={link.href}>{link.caption}</a>
                                        ))}
                                    </div>
                                </div>
                            </article>
                        </div>
                    ))}
                </div>
            </div>
        </main>
    );
}
