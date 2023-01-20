import React from 'react'
import { createHashRouter, Navigate, RouterProvider } from 'react-router-dom'

import { Spinner } from 'cozy-ui/transpiled/react'

import Layout from './Layout'
import Timeline from '../ducks/timeline'
import { AlbumsView, AlbumPhotos, PhotosPicker } from '../ducks/albums'
import { TimelinePhotosViewer, AlbumPhotosViewer } from './PhotosViewer'

const router = createHashRouter([
  {
    element: <Layout />,
    children: [
      {
        path: '/*',
        element: <Navigate to="photos" replace />
      },
      {
        path: 'photos',
        element: <Timeline />,
        children: [
          {
            path: ':photoId',
            element: <TimelinePhotosViewer />
          }
        ]
      },
      {
        path: 'albums',
        children: [
          {
            path: '',
            element: <AlbumsView />
          },
          {
            path: 'new',
            element: <PhotosPicker />
          },
          {
            path: ':albumId',
            element: <AlbumPhotos />,
            children: [
              {
                path: 'edit',
                element: <PhotosPicker />
              },
              {
                path: ':photoId',
                element: <AlbumPhotosViewer />
              }
            ]
          }
        ]
      }
    ]
  }
])

const AppRouter = () => (
  <RouterProvider router={router} fallbackElement={<Spinner />} />
)

export default AppRouter